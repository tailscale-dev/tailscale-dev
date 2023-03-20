# Looker

[Looker](https://bulbapedia.bulbagarden.net/wiki/Looker) is a HTTP frontend to [Sonic](https://github.com/valeriansaliou/sonic). It translates HTTP search queries into TCP sonic queries and returns results. Looker requires a local copy of Sonic running. If you have [Nix](https://nixos.org/) installed, you can run a local copy like this:

```
cd ../sonic
nix shell nixpkgs#sonic-server
sonic -c ./local.cfg
```

Leave this running in the background.

## API

To make queries, send an authenticated request to `/api/search`:

```console
$ curl "http://localhost:9001/api/search?q=emacs" -H "Authorization: Bearer hunter2"
{"posts":["blog/configuring-emacs-mdx"]}
```

To purge all search entries, send an authenticated request to `/api/looker/purge`:

```console
$ curl "http://localhost:9001/api/looker/purge" -H "Authorization: Bearer hunter2"
OK
```

Looker should recieve webhooks from Vercel to trigger re-indexing the blog collection. You can test this by launching Looker in `--dev-mode` and then sending a POST request to `/api/webhook/vercel`:

```console
$ curl -XPOST "http://localhost:9001/api/webhook/vercel" --data '{"type": "deployment.succeeded"}'
OK
```

This can and should be modified in the future to handle multiple repositories.
