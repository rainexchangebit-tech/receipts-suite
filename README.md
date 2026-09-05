# Receipts Suite

One deployable repository for the receipt applications and their shared hub.

## Available routes

| Route | Status |
| --- | --- |
| `/` | Hub |
| `/binance-withdraw/` | Available |
| `/binance-deposit/` | Coming soon |
| `/okx-withdraw/` | Coming soon |
| `/okx-deposit/` | Coming soon |
| `/crypto-deposit/` | Coming soon |
| `/binance-home/` | Coming soon |

## Local checks

```sh
npm run install:apps
npm run typecheck
npm run build
npm run preview
docker build -t receipts-suite .
docker run --rm -p 8080:8080 receipts-suite
```

The local preview opens at `http://127.0.0.1:4173/`. A built container uses
`http://127.0.0.1:8080/`. Available receipts open in a new browser tab.

## Coolify

Create one Dockerfile-based application from this repository. The container
listens on port `8080`; Coolify should route the application's main domain to
that port. No database, persistent volume, or VPS-level web-server changes are
required.
