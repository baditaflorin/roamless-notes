# Deploy

Roamless Notes is deployed as a GitHub Pages static site from the `main` branch `/docs` directory.

Live URL: `https://baditaflorin.github.io/roamless-notes/`

## Publish

```bash
make build
git add docs
git commit -m "chore: publish pages build"
git push origin main
```

GitHub Pages then serves the committed `docs/index.html`.

## Rollback

Revert the publishing commit that changed `docs/`, then push `main`.

## Custom Domain

If a custom domain is added later, create `docs/CNAME` with the hostname, configure DNS with the GitHub Pages records, and update `vite.config.ts` only if the base path changes.
