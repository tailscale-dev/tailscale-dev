package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/netip"
	"net/url"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

var (
	devMode    = flag.Bool("dev", false, "if set, enable development mode (recompile and download yarn packages)")
	serverPort = flag.Int("port", 3000, "the port to listen on, next will use port+1")
)

func runCMD(command string, args ...string) error {
	if *devMode {
		log.Printf("running %s: %+v", command, args)
	}

	cmdPath, err := exec.LookPath(command)
	if err != nil {
		log.Printf("can't find %s in $PATH: %v", command, err)
		return err
	}

	cmd := exec.Command(cmdPath, args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func ensureNodeModulesInPath() {
	for _, pathSeg := range strings.Split(os.Getenv("PATH"), ":") {
		if strings.HasSuffix(pathSeg, "node_modules/.bin") {
			return
		}
	}

	pwd, err := os.Getwd()
	if err != nil {
		log.Fatalf("[unexpected] your program has no working directory, this should be impossible, right? %v", err)
	}

	os.Setenv("PATH", fmt.Sprintf("%s:%s/node_modules/.bin", os.Getenv("PATH"), pwd))
}

func main() {
	flag.Parse()

	nextVerb := "start"

	if *devMode {
		if err := runCMD("yarn"); err != nil {
			log.Fatal(err)
		}
		nextVerb = "dev"
	}

	ensureNodeModulesInPath()

	next, err := exec.LookPath("next")
	if err != nil {
		log.Fatalf("please install node dependencies: %v", err)
	}
	nextPort := *serverPort + 1

	cmd := exec.Command(next, nextVerb, "-p", strconv.Itoa(nextPort))
	cmd.Stderr = os.Stderr
	cmd.Stdout = os.Stdout
	if err := cmd.Start(); err != nil {
		log.Fatalf("can't start next serve: %v", err)
	}

	defer cmd.Process.Kill()

	mux := http.NewServeMux()
	u, err := url.Parse("http://" + netip.MustParseAddrPort("127.0.0.1:"+strconv.Itoa(nextPort)).String())
	if err != nil {
		log.Fatal("[unexpected]", err)
	}

	mux.Handle("/", httputil.NewSingleHostReverseProxy(u))
	mux.HandleFunc("/.tailscale/api/ping", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "hi!")
	})

	log.Printf("[go] listening on http://0.0.0.0:%[1]d, http://localhost:%[1]d", *serverPort)
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(*serverPort), mux))
}
