package main

import (
	"bytes"
	"flag"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"golang.org/x/net/html"
)

const gitTimeFormat = "Mon Jan 2 15:04:05 2006 -0700"

func main() {
	flag.Parse()

	if flag.NArg() != 1 {
		log.Fatal("give path to folder to convert")
	}

	dir := flag.Arg(0)
	log.Println("processing", dir)

	fnameBase := filepath.Base(dir)
	log.Println("calling this", fnameBase)

	if _, err := os.Stat(filepath.Join(dir, "index.md")); err != nil {
		log.Fatalf("no index.md: %v", err)
	}

	age, err := ascertainAge(dir, "index.md")
	if err != nil {
		log.Fatalf("can't detect age: %v", err)
	}

	log.Println("originally published:", age.Format(time.DateOnly))

	fout, err := os.Create(filepath.Join("data", "solutions", fnameBase+".mdx"))
	if err != nil {
		log.Fatalf("can't open mdx file for writing: %v", err)
	}
	defer fout.Close()

	data, err := os.ReadFile(filepath.Join(dir, "index.md"))
	if err != nil {
		log.Fatalf("")
	}

	inFrontMatter := false

	for _, line := range bytes.Split(data, []byte("\n")) {
		lineStr := string(bytes.TrimSpace(line))
		if lineStr == "---" {
			inFrontMatter = !inFrontMatter
		}

		if strings.HasPrefix(lineStr, "summary:") {
			fmt.Fprintf(fout, "date: %s\n", age.Format(time.DateOnly))
		}

		// acorn handling
		if strings.HasPrefix(lineStr, "{{<") {
			// notes
			switch lineStr {
			case "{{<note>}}", "{{ <note> }}":
				fmt.Fprintln(fout, "<Note>")
				continue
			case "{{</note>}}", "{{ </note> }}":
				fmt.Fprintln(fout, "</Note>")
				continue
			}

			// figures
			if strings.HasPrefix(lineStr, "{{< figure") {
				imageMeta := map[string]string{}

				_, attrs, found := strings.Cut(lineStr, "figure ")
				if !found {
					log.Fatal("WTF??", lineStr)
				}
				attrs = fmt.Sprintf("<img %s />", attrs[:len(attrs)-3])
				log.Println(attrs)
				node, err := html.Parse(strings.NewReader(attrs))
				if err != nil {
					log.Fatal(lineStr, err)
				}
				var imgNode *html.Node
				var findIMGTag func(n *html.Node)
				findIMGTag = func(n *html.Node) {
					if n.Type == html.ElementNode && n.Data == "img" {
						imgNode = n
						return
					}
					for c := n.FirstChild; c != nil; c = c.NextSibling {
						findIMGTag(c)
					}
				}
				findIMGTag(node)

				for _, attr := range imgNode.Attr {
					switch attr.Key {
					case "width", "height":
						continue
					default:
						if attr.Key != "src" {
							imageMeta[attr.Key] = fmt.Sprintf("%q", attr.Val)
						} else {
							imageMeta[attr.Key] = attr.Val
						}
					}
				}

				log.Printf("%#v", imageMeta)

				fin, err := os.Open(filepath.Join(dir, imageMeta["src"]))
				if err != nil {
					log.Fatal("file refers to a nonexistent image")
				}
				defer fin.Close()

				img, imgFormat, err := image.Decode(fin)
				if err != nil {
					log.Fatalf("can't decode %s: %v", imageMeta["src"], err)
				}

				log.Printf("%s: %s", imageMeta["src"], imgFormat)

				imageMeta["width"] = fmt.Sprintf("{%d}", img.Bounds().Max.X)
				imageMeta["height"] = fmt.Sprintf("{%d}", img.Bounds().Max.Y)

				fmt.Fprint(fout, "<br />\n<Image ")

				for k, v := range imageMeta {
					if k == "src" {
						v = fmt.Sprintf("%q", "/images/solutions/"+fnameBase+"/"+v)
					}
					fmt.Fprintf(fout, "%s=%s ", k, v)
				}

				fmt.Fprintln(fout, "/>")

				toDir := filepath.Join("public", "images", "solutions", fnameBase)
				os.MkdirAll(toDir, 0777)
				if err := copyFile(filepath.Join(dir, imageMeta["src"]), "./"+filepath.Join(toDir, imageMeta["src"])); err != nil {
					log.Fatalf("can't copy file: %v", err)
				}

				continue
			}

			log.Fatal("unknown acorn:", lineStr)
		}

		fout.Write(line)
		fmt.Fprintln(fout)
	}
}

func ascertainAge(dir, fname string) (*time.Time, error) {
	gitPath, err := exec.LookPath("git")
	if err != nil {
		log.Fatalf("git not present in $PATH, fundamental assertion violated: %v", err)
	}

	cmd := exec.Command(gitPath, "log", "--follow", "--format=%ad", "--date", "default", fname)
	buf := &bytes.Buffer{}
	cmd.Dir = dir
	cmd.Stdout = buf
	cmd.Stderr = os.Stderr
	cmd.Stdin = nil

	if err := cmd.Run(); err != nil {
		return nil, err
	}

	lines := bytes.Split(buf.Bytes(), []byte("\n"))
	line := string(lines[len(lines)-2])

	when, err := time.Parse(gitTimeFormat, line)
	if err != nil {
		return nil, err
	}

	return &when, nil
}

func copyFile(from, to string) error {
	sourceFile, err := os.Open(from)
	if err != nil {
		return fmt.Errorf("can't open source file %s: %v", from, err)
	}
	defer sourceFile.Close()

	destFile, err := os.Create(to)
	if err != nil {
		return fmt.Errorf("can't open dest file %s: %v", to, err)
	}
	defer destFile.Close()

	_, err = io.Copy(destFile, sourceFile)
	if err != nil {
		log.Fatal(err)
	}

	return nil
}
