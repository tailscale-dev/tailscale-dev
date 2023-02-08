// This script deploys a preview app for a PR to Fly.io, and cleans it up after
// the PR is closed. It's intended to be run inside GitHub Actions.
package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"regexp"
)

var (
	appName 			= flag.String("name", "", "Name of the app")
	appOrg        = flag.String("org", "personal", "Name of the org")
	appRegion     = flag.String("region", "iad", "Region to deploy the app in")
	configPath    = flag.String("path", "./fly.toml", "Path to fly.toml")
	volumeName    = flag.String("volume-name", "", "Name of the volume to create and attach to the app")
	volumeSize    = flag.String("volume-size", "3", "Size of volume")
	environment   = flag.String("environment", "", "Name of the GitHub environment to manage")
	event         = flag.String("event", "", "Type of GitHub PR event to respond to")
	deleteEnv     = flag.Bool("delete-environment", false, "Delete the GitHub environment after the PR is closed")
	repoName		  = flag.String("repo-name", "", "Github name, including organization, of the repository, e.g. tailscale-dev/www")
	vmSize		    = flag.String("vm-size", "256", "Size of the VM to use, e.g. 256, defaults to 256")
)

func main() {
	flag.Parse()
	if *appName == "" {
		log.Fatal("--name is required")
	}
	if !hasPRNumber(*appName) {
		log.Fatal("--name must include a PR number")
	}
	if *event == "" {
		log.Fatal("--event is required")
	}
	if *event == "" {
		log.Fatal("--event is required")
	}

	if *event == "closed" {
		if err := destroyApp(*appName); err != nil {
			log.Fatalf("error destroying app: %s", err)
		}
		if *environment == "" || !*deleteEnv {
			return
		}
		if err := destroyGitHubEnvironment(*environment); err != nil {
			log.Fatalf("error destroying GitHub environment: %s", err)
		}
		return
	}

	err := deployApp(*appName, *appOrg, *appRegion, *configPath, *volumeName, *volumeSize)
	if err != nil {
		log.Fatalf("error deploying app: %s", err)
	}

	status, err := getStatus(*appName)
	if err != nil {
		log.Fatalf("error getting status: %s", err)
	}
	output := openGithubOutput()
	defer output.Close()
	fmt.Fprintf(output, "hostname="+status.Hostname+"\n")
	fmt.Fprintf(output, "url=https://"+status.Hostname+"\n")
	fmt.Fprintf(output, "id="+status.ID+"\n")
}

// flyStatusResponse returns details from a `flyctl status` command.
type flyStatusResponse struct {
	ID       string
	Hostname string
}

// Write values to the file specified in the GITHUB_OUTPUT env var
func openGithubOutput() io.ReadWriteCloser {
	fName := os.Getenv("GITHUB_OUTPUT")
	if fName == "" {
		log.Fatalf("no GITHUB_OUTPUT variable set")
	}
	f, err := os.OpenFile(fName, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatalf("error writing to GITHUB_OUTPUT status: %s", err)
	}
	return f
}

func getStatus(appName string) (flyStatusResponse, error) {
	cmd := exec.Command("flyctl", "status", "--app", appName, "--json")
	b, err := cmd.Output()
	if err != nil {
		return flyStatusResponse{}, err
	}
	var status flyStatusResponse
	err = json.Unmarshal(b, &status)
	if err != nil {
		return flyStatusResponse{}, err
	}
	return status, nil
}

var (
	flyConfigNameRegexp = regexp.MustCompile(`^app = "[a-zA-Z0-9-]+"`)
	flyConfigEnvRegexp  = regexp.MustCompile(`\n\[env\]`)
)

func deployApp(name, org, region, configPath string, volumeName string, volumeSize string) error {
	flyConfig, err := os.ReadFile(configPath)
	if err != nil {
		return fmt.Errorf("error reading fly.toml: %w", err)
	}

	// Modify our standard fly.toml to use the PR number as the app name,
	// and inject a FLY_DEPLOY_PREVIEW env variable.
	newConfig := flyConfig
	newConfig = flyConfigNameRegexp.ReplaceAll(newConfig, []byte(fmt.Sprintf(`app = "%s"`, name)))
	newConfig = flyConfigEnvRegexp.ReplaceAll(newConfig, []byte("\n[env]\n  FLY_DEPLOY_PREVIEW = \"true\""))
	f, err := os.Create("fly.preview.toml")
	if err != nil {
		return fmt.Errorf("error creating temporary file: %w", err)
	}
	defer f.Close()
	if _, err := f.Write(newConfig); err != nil {
		return fmt.Errorf("error writing temporary file: %w", err)
	}
	if err := f.Sync(); err != nil {
		return fmt.Errorf("error syncing temporary file: %w", err)
	}
	newConfigPath := f.Name()

	if !appExists(name) {
		fmt.Printf("flyctl apps create --name %s --org %s", name, org)
		createCmd := exec.Command("flyctl", "apps", "create", "--name", name, "--org", org)
		if err := createCmd.Run(); err != nil {
			return fmt.Errorf("error creating app: %w", err)
		}

		if (volumeName != "") {
			createCmd := exec.Command("flyctl", "volumes", "create", volumeName, "--config", newConfigPath, "--region", region, "--size", volumeSize)
			if err := createCmd.Run(); err != nil {
				return fmt.Errorf("error creating volume: %w", err)
			}
		}

		scaleCmd := exec.Command("flyctl", "scale", "memory", *vmSize, "--app", name, "--config", newConfigPath, "--json")
		scaleCmd.Stdout = os.Stdout
		scaleCmd.Stderr = os.Stderr
		if err := scaleCmd.Run(); err != nil {
			return fmt.Errorf("error scaling app: %w", err)
		}
	}

	deployCmd := exec.Command(
		"flyctl", "deploy",
		"--app", name,
		"--config", newConfigPath,
		"--region", region,
		"--strategy", "immediate",
	)
	deployCmd.Stdout = os.Stdout
	deployCmd.Stderr = os.Stderr
	if err := deployCmd.Run(); err != nil {
		return fmt.Errorf("error deploying app: %w", err)
	}
	return nil
}

func destroyApp(appName string) error {
	if !hasPRNumber(appName) {
		// Safety check to make sure we only delete preview apps
		return errors.New("can only delete apps with a PR number")
	}
	cmd := exec.Command("flyctl", "apps", "destroy", appName, "-y")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return err
	}
	return nil
}

func destroyGitHubEnvironment(envName string) error {
	ctx := context.Background()
	deployments, err := listGitHubDeployments(ctx, envName)
	if err != nil {
		return err
	}
	for _, deployment := range deployments {
		if err := deleteGitHubDeployment(ctx, deployment.ID); err != nil {
			return err
		}
	}
	return nil
}

var (
	githubDeploymentsURL = "https://api.github.com/repos/" + *repoName + "/deployments"
)

type githubDeployment struct {
	ID          int64  `json:"id"`
	URL         string `json:"url"`
	Environment string `json:"environment"`
}

func listGitHubDeployments(ctx context.Context, envName string) ([]*githubDeployment, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", githubDeploymentsURL+"?environment="+envName, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}
	var deployments []*githubDeployment
	err = githubJSONReq(req, &deployments)
	if err != nil {
		return nil, fmt.Errorf("error getting deployments: %w", err)
	}
	return deployments, nil
}

func deleteGitHubDeployment(ctx context.Context, deployID int64) error {
	deploymentURL := fmt.Sprintf("%s/%d", githubDeploymentsURL, deployID)
	// First, we have to mark the deployment as inactive
	body := bytes.NewReader([]byte(`{"state":"inactive"}`))
	req, err := http.NewRequestWithContext(ctx, "POST", deploymentURL+"/statuses", body)
	if err != nil {
		return fmt.Errorf("error creating request: %w", err)
	}
	err = githubJSONReq(req, nil)
	if err != nil {
		return fmt.Errorf("error marking deployment as inactive: %w", err)
	}

	// Then, we can delete the deployment
	req, err = http.NewRequestWithContext(ctx, "DELETE", deploymentURL, nil)
	if err != nil {
		return fmt.Errorf("error creating request: %w", err)
	}
	err = githubJSONReq(req, nil)
	if err != nil {
		return fmt.Errorf("error deleting deployment: %w", err)
	}
	return nil
}

func githubJSONReq(req *http.Request, r interface{}) error {
	githubToken := os.Getenv("GITHUB_TOKEN")
	if githubToken == "" {
		return errors.New("GITHUB_TOKEN is not set")
	}

	req.Header.Set("Authorization", "token "+githubToken)
	req.Header.Set("Accept", "application/vnd.github+json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusNoContent {
		return fmt.Errorf("error making request: %s", resp.Status)
	}
	b, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("error reading response: %w", err)
	}
	err = json.Unmarshal(b, &r)
	if err != nil {
		return fmt.Errorf("error unmarshalling response: %w", err)
	}
	return nil
}

func appExists(appName string) bool {
	cmd := exec.Command("flyctl", "status", "--app", appName)
	err := cmd.Run()
	return err == nil
}

var prNumberRegexp = regexp.MustCompile("pr-[0-9]+")
func hasPRNumber(appName string) bool {
	return prNumberRegexp.MatchString(appName)
}