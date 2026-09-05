#!/bin/sh
set -eu

PORT=3001 HOST=127.0.0.1 VITE_AUTH_ENABLED=false node /opt/receipts/binance-withdraw/server/index.mjs &
receipt_pid=$!
PORT=3002 HOST=127.0.0.1 VITE_AUTH_ENABLED=false node /opt/receipts/binance-deposit/server/index.mjs &
deposit_pid=$!
PORT=3003 HOST=127.0.0.1 VITE_AUTH_ENABLED=false node /opt/receipts/crypto-deposit/server/index.mjs &
crypto_deposit_pid=$!

trap 'kill "$receipt_pid" "$deposit_pid" "$crypto_deposit_pid" 2>/dev/null || true' INT TERM EXIT
exec nginx -g 'daemon off;'
