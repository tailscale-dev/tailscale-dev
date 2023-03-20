package main

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/expectedsh/go-sonic/sonic"
	"github.com/go-git/go-git/v5"
	_ "github.com/joho/godotenv/autoload"
)

var (
	bind                = flag.String("bind", ":"+os.Getenv("PORT"), "host:port to bind on, defaults to :$PORT")
	devMode             = flag.Bool("dev-mode", envToBool("DEV_MODE"), "if set, don't require authentication for vercel webhooks")
	purgeToken          = flag.String("purge-token", os.Getenv("PURGE_TOKEN"), "Authorization token required to purge things")
	searchToken         = flag.String("search-token", os.Getenv("SEARCH_TOKEN"), "Authorization token required to search things")
	sonicServer         = flag.String("sonic-server", os.Getenv("SONIC_SERVER"), "Sonic server host")
	sonicPort           = flag.Int("sonic-port", 1491, "Sonic server port")
	sonicPass           = flag.String("sonic-pass", os.Getenv("SONIC_PASSWORD"), "Sonic password")
	vercelWebhookSecret = flag.String("vercel-webhook-secret", os.Getenv("VERCEL_WEBHOOK_SECRET"), "Vercel webhook signing secret")
)

func main() {
	flag.Parse()

	if *devMode {
		log.Println("Developer mode enabled. Vercel webhook authentication disabled.")
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/api/search", searchArticles)
	mux.HandleFunc("/api/looker/purge", purgeCollection)
	mux.HandleFunc("/api/webhook/vercel", handleWebhook)
	mux.HandleFunc("/health", healthCheck)

	log.Printf("listening on %s", *bind)
	log.Fatal(http.ListenAndServe(*bind, mux))
}

func envToBool(name string) bool {
	val, _ := strconv.ParseBool(os.Getenv(name))
	return val
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	doer := func() error {
		c, err := sonic.NewControl(*sonicServer, *sonicPort, *sonicPass)
		if err != nil {
			return err
		}
		if err := c.Ping(); err != nil {
			return err
		}

		return c.Quit()
	}

	if err := doer(); err != nil {
		log.Printf("healthcheck failed: %v", err)
		http.Error(w, "NOT OK", http.StatusInternalServerError)
		return
	}
	fmt.Fprintln(w, "OK")
}

// Define a function that takes a byte slice and a string as parameters
func sha1Hmac(data []byte, secret string) string {
	h := hmac.New(sha1.New, []byte(secret))
	h.Write(data)
	b := h.Sum(nil)
	s := hex.EncodeToString(b)
	return s
}

func handleWebhook(w http.ResponseWriter, r *http.Request) {
	if !*devMode {
		vercelSig := r.Header.Get("X-Vercel-Signature")
		if vercelSig == "" {
			http.Error(w, "invalid or missing signature", http.StatusUnauthorized)
			return
		}

		defer r.Body.Close()

		data, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "invalid or missing signature", http.StatusUnauthorized)
			return
		}

		mySig := sha1Hmac(data, *vercelWebhookSecret)

		if mySig != vercelSig {
			log.Printf("invalid webhook secret: %q, wanted %q", vercelSig, mySig)
			http.Error(w, "invalid or missing signature", http.StatusUnauthorized)
			return
		}
	}

	if r.Method != http.MethodPost {
		http.Error(w, "want POST", http.StatusMethodNotAllowed)
		return
	}

	var payload VercelWebhookPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}

	if payload.Type != "deployment.succeeded" {
		log.Printf("wanted deployment.succeeded, got %q", payload.Type)
		fmt.Fprintln(w, "OK")
		return
	}

	go func() {
		log.Println("starting indexing of posts")

		if err := grabRepoAndSubmitArticlesToSonic(); err != nil {
			log.Printf("can't grab from git and push to sonic: %v", err)
			return
		}

		log.Println("done!")
	}()

	fmt.Fprintln(w, "OK")
}

func purgeCollection(w http.ResponseWriter, r *http.Request) {
	if auth := r.Header.Get("Authorization"); auth == "" || auth != fmt.Sprintf("Bearer %s", *purgeToken) {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(struct {
			Message string `json:"message"`
		}{
			Message: "authorization required",
		})
		return
	}

	if err := actuallyDoPurge(); err != nil {
		log.Printf("purge failed: %v", err)
		http.Error(w, "can't purge: "+err.Error(), http.StatusInternalServerError)
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
	if auth := r.Header.Get("Authorization"); auth == "" || auth != fmt.Sprintf("Bearer %s", *searchToken) {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(struct {
			Message string `json:"message"`
		}{
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
		}{
			Message: "no results found",
		})
		return
	}

	json.NewEncoder(w).Encode(struct {
		Posts []string `json:"posts"`
	}{
		Posts: results,
	})
}

func getNameWithoutExt(file string) string {
	base := filepath.Base(file)
	ext := filepath.Ext(base)
	return strings.TrimSuffix(base, ext)
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

type VercelWebhookPayload struct {
	ID        string          `json:"id"`
	Type      string          `json:"type"`
	CreatedAt int64           `json:"createdAt"`
	Region    *string         `json:"region"`
	Payload   json.RawMessage `json:"payload"`
}

type VercelID[T any] struct {
	ID T `json:"id"`
}

type VercelDeployment struct {
	ID   string         `json:"id"`
	Meta map[string]any `json:"meta"`
	URL  string         `json:"url"`
	Name string         `json:"name"`
}

type VercelDeploymentSucceeded struct {
	Team       VercelID[[]string] `json:"team"`
	User       VercelID[[]string] `json:"user"`
	Deployment VercelDeployment   `json:"deployment"`

	Links struct {
		Deployment string `json:"deployment"`
		Project    string `json:"project"`
	} `json:"links"`

	Target  string           `json:"string"`
	Project VercelID[string] `json:"project"`
	Plan    string           `json:"plan"`
	Regions []string         `json:"regions"`
}
