{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
  utils.lib.eachDefaultSystem (system:
  let upstream = nixpkgs.legacyPackages.${system};
  lib = upstream.lib;
  tailscale-go-rev = lib.fileContents ./go.toolchain.rev;
  tailscale-go-sri = lib.fileContents ./go.toolchain.sri;

  withTSGo = pkgs: upstream.extend (final: prev: rec {
    tailscale_go = prev.lib.overrideDerivation prev.go_1_20 (attrs: rec {
      name = "tailscale-go-${version}";
      version = tailscale-go-rev;
      src = pkgs.fetchFromGitHub {
        owner = "tailscale";
        repo = "go";
        rev = tailscale-go-rev;
        sha256 = tailscale-go-sri;
      };
      nativeBuildInputs = attrs.nativeBuildInputs ++ [ pkgs.git ];
		  # Remove dependency on xcbuild as that causes iOS/macOS builds to fail.
      propagatedBuildInputs = [];
      checkPhase = "";
      TAILSCALE_TOOLCHAIN_REV = tailscale-go-rev;
    });
    # Override go_1_20 so that all go binaries are built with tailscale's go toolchain
    go_1_20 = tailscale_go;
    go_1_19 = tailscale_go;
  });

  pkgs = withTSGo upstream;
  in
  {
    devShells.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        nodejs-18_x
        yarn

        # go tools
        tailscale_go
        go-tools
        gotools
        gopls
      ];
      shellHook = ''
        export PATH="$PATH":$(pwd)/node_modules/.bin
      '';
    };
  });
}
