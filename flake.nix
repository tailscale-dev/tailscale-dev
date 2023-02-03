{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
  utils.lib.eachDefaultSystem (system:
  let upstream = nixpkgs.legacyPackages.${system};

  withGo120 = pkgs: upstream.extend (final: prev: rec {
    # Override go_1_20 so that all go binaries are built with tailscale's go toolchain
    go_1_19 = pkgs.go_1_20;
  });

  pkgs = withGo120 upstream;
  in
  {
    devShells.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        nodejs-18_x
        yarn

        # go tools
        go
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
# nix-direnv cache busting line: sha256-Y4HgqikudINw28LcX4EVONxmtR0CEGKM3M76ahzfuFY=
