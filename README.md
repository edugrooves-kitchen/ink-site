# Ink & Inference — static site, publish verbatim

`dist/` is the finished static export of the Ink & Inference website. **Publish it byte for byte.** Do not
rebuild, redesign, reformat, minify, re-encode or "improve" anything. There is no build step: the export is
the source.

## What is here

| Path | Purpose |
| --- | --- |
| `dist/index.html` | The page. All asset URLs are relative, so it works at any subpath (IPFS gateways, ENS). |
| `dist/assets/` | The compiled script and stylesheet. |
| `dist/favicon.svg`, `dist/robots.txt` | As shipped. |
| `dist/MANIFEST.json` | sha256 and size of every file in `dist/`, plus the commit it was built from. |
| `scripts/verify.mjs` | Checks every file against the manifest and fails on any change or extra file. |

Routing uses the URL hash (`#/site/claim`, `#/site/explorer`, …), so every page works from `index.html` alone
with no server rewrites.

## Verify

Requires Node 18+ and nothing else (no dependencies):

```bash
node scripts/verify.mjs dist
# → 6 files match MANIFEST.json
```

## Preview

```bash
python3 -m http.server 4173 --directory dist
# → http://127.0.0.1:4173/
```

## External calls (intentional)

- Fonts from Google Fonts.
- Read-only Ethereum reads through public RPC endpoints, and a browser wallet if the visitor connects one.

The site has no backend. Seat records, the claim snapshot and contract addresses ship with the contract
launch. Until then those views read "Seat records open at launch." and nothing can be sent.

## Provenance

Built with `node scripts/export-site.mjs` from the private Ink & Inference workspace at the commit recorded in
`dist/MANIFEST.json` (`sourceCommit`).
