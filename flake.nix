{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
  utils.lib.eachDefaultSystem (system:
  let upstream = nixpkgs.legacyPackages.${system};

  withGo120 = pkgs: upstream.extend (final: prev: rec {
    # Override go_1_19 so that go-tools, gotools, and gopls are built with Go 1.20
    #
    # Listen here to my tale of woe: if these tools are built with an older version
    # of the go compiler toolchain, this will cause them to get angy when Tailscale
    # code inevitably uses Go 1.20 features out of an understandable desire to have
    # nice things. As of the time of writing this comment, there is no good way to
    # override the version of Go that `buildGo119Module` (the main entrypoint to
    # build Go 1.19 modules in Nix-land) uses. This is a HACK and I hate it but
    # this will in fact work because buildGo119Module pulls from the `go_1_19`
    # package.
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
        go_1_20
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
