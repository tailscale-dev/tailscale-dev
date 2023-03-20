package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/expectedsh/go-sonic/sonic"
	"github.com/go-git/go-git/v5"
	_ "github.com/joho/godotenv/autoload"
)

var (
	bind = flag.String("bind", ":" + os.Getenv("PORT"), "host:port to bind on, defaults to :$PORT")
	purgeToken = flag.String("purge-token", os.Getenv("PURGE_TOKEN"), "Authorization token required to purge things")
	searchToken = flag.String("search-token", os.Getenv("SEARCH_TOKEN"), "Authorization token required to search things")
	sonicServer = flag.String("sonic-server", os.Getenv("SONIC_SERVER"), "Sonic server host")
	sonicPort = flag.Int("sonic-port", 1491, "Sonic server port")
	sonicPass = flag.String("sonic-pass", os.Getenv("SONIC_PASSWORD"), "Sonic password")
)

func main() {
	flag.Parse()

	c, err := sonic.NewControl(*sonicServer, *sonicPort, *sonicPass)
	if err != nil {
		log.Fatal(err)
	}
	if err := c.Ping(); err != nil {
		log.Fatal(err)
	}

	c.Quit()

	log.Println("Sonic works!")

	mux := http.NewServeMux()
	mux.HandleFunc("/api/search", searchArticles)
	mux.HandleFunc("/api/looker/purge", purgeCollection)
	mux.HandleFunc("/api/webhook/vercel", handleWebhook)

	log.Printf("listening on %s", *bind)
	log.Fatal(http.ListenAndServe(*bind, mux))
}

func handleWebhook(w http.ResponseWriter, r *http.Request) {
	if err := grabRepoAndSubmitArticlesToSonic(); err != nil {
		http.Error(w, "can't grab from git and push to search provider", http.StatusInternalServerError)
		log.Printf("can't grab from git and push to sonic: %v", err)
		return 
	}
	fmt.Fprintln(w, "OK")
}

func purgeCollection(w http.ResponseWriter, r *http.Request)  {
	if err := actuallyDoPurge(); err != nil {
		log.Printf("purge failed: %v", err)
		http.Error(w, "can't purge: " + err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintln(w, "OK")
}

func actuallyDoPurge() error {
	ing, err := sonic.NewIngester(*sonicServer, *sonicPort, *sonicPass)
	if err != nil {
		return err
	}
	defer ing.Quit()

	if err := ing.FlushCollection("posts"); err != nil {
		return err
	}

	return nil
}

func searchArticles(w http.ResponseWriter, r *http.Request) {
	auth := r.Header.Get("Authorization")
	if auth == "" || auth != fmt.Sprintf("Bearer %s", *searchToken) {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(struct {
			Message string `json:"message"`
		} {
			Message: "authorization required",
		})
		return
	}

	srchr, err := sonic.NewSearch(*sonicServer, *sonicPort, *sonicPass)
	if err != nil {
		log.Printf("can't reach sonic: %v", err)
		http.Error(w, "can't reach search provider", http.StatusInternalServerError)
		return
	}

	q := r.URL.Query().Get("q")

	results, err := srchr.Query("posts", "posts", q, 15, 0, sonic.LangEng)
	if err != nil {
		log.Printf("can't get results from sonic: %v", err)
		http.Error(w, "can't get results from search provider", http.StatusInternalServerError)
		return
	}

	if len(results) == 1 && results[0] == "" {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(struct {
			Message string `json:"message"`
		} {
			Message: "no results found",
		})
		return
	}

	json.NewEncoder(w).Encode(struct {
		Posts []string `json:"posts"` 
	} { 
		Posts: results,
	})
}

func getNameWithoutExt(file string) string {
	base := filepath.Base(file) // get the base name of the file
	ext := filepath.Ext(base)   // get the extension of the file
	return strings.TrimSuffix(base, ext) // remove the extension from the base name
}

func ingest(ing sonic.Ingestable, collection, fname string) error {
	fin, err := os.Open(fname)
	if err != nil {
		return err
	}
	defer fin.Close()

	data, err := io.ReadAll(fin)
	if err != nil {
		return err
	}

	log.Printf("pushing %s (%d bytes)", fname, len(data))

	objectName := collection + "/" + getNameWithoutExt(fname)

	if err := ing.Push("posts", "posts", objectName, string(data), sonic.LangEng); err != nil {
		return err
	}

	return nil
}

func grabRepoAndSubmitArticlesToSonic() error {
	dir, err := os.MkdirTemp("", "tsdev")
	if err != nil {
		return err
	}
	defer os.RemoveAll(dir)

	ing, err := sonic.NewIngester(*sonicServer, *sonicPort, *sonicPass)
	if err != nil {
		return err
	}
	defer ing.Quit()

	_, err = git.PlainClone(dir, false, &git.CloneOptions{
		URL:      "https://github.com/tailscale-dev/tailscale-dev",
		Progress: os.Stdout,
	})
	if err != nil {
		return err
	}

	err = filepath.Walk(filepath.Join(dir, "data", "blog"), func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			if err := ingest(ing, "blog", path); err != nil {
				return err
			}
		}
		return nil
	})

	return err
}