{
  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      let pkgs = nixpkgs.legacyPackages.${system}; in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs-18_x
            yarn

            # XXX(Xe): temporary hack for convert.go
            go_1_20
            gotools
            go-tools
            gopls
          ];
          shellHook = ''
            export PATH="$PATH":$(pwd)/node_modules/.bin
          '';
        };
      });
}
