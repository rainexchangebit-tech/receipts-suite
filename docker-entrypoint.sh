#!/bin/sh
set -eu

PORT=3001 HOST=127.0.0.1 VITE_AUTH_ENABLED=false node /opt/receipts/binance-withdraw/server/index.mjs &
receipt_pid=$!

trap 'kill "$receipt_pid" 2>/dev/null || true' INT TERM EXIT
exec nginx -g 'daemon off;'
