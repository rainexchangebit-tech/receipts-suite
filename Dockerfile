FROM node:24-alpine AS binance-withdraw-build
WORKDIR /build/binance-withdraw
ENV VITE_AUTH_ENABLED=false
COPY apps/binance-withdraw/package.json apps/binance-withdraw/package-lock.json ./
RUN npm ci --include=dev
COPY apps/binance-withdraw/ ./
RUN npm run typecheck && npm run build

FROM node:24-alpine AS binance-deposit-build
WORKDIR /build/binance-deposit
ENV VITE_AUTH_ENABLED=false
COPY apps/binance-deposit/package.json apps/binance-deposit/package-lock.json ./
RUN npm ci --include=dev
COPY apps/binance-deposit/ ./
RUN npm run typecheck && npm run build

FROM node:24-alpine AS crypto-deposit-build
WORKDIR /build/crypto-deposit
ENV VITE_AUTH_ENABLED=false
COPY apps/crypto-deposit/package.json apps/crypto-deposit/package-lock.json ./
RUN npm ci --include=dev
COPY apps/crypto-deposit/ ./
RUN npm run typecheck && npm run build

FROM node:24-alpine AS okx-deposit-build
WORKDIR /build/okx-deposit
ENV VITE_AUTH_ENABLED=false
COPY apps/okx-deposit/package.json apps/okx-deposit/package-lock.json ./
RUN npm ci --include=dev
COPY apps/okx-deposit/ ./
RUN npm run typecheck && npm run build

FROM node:24-alpine AS okx-withdraw-build
WORKDIR /build/okx-withdraw
ENV VITE_AUTH_ENABLED=false
COPY apps/okx-withdraw/package.json apps/okx-withdraw/package-lock.json ./
RUN npm ci --include=dev
COPY apps/okx-withdraw/ ./
RUN npm run typecheck && npm run build

FROM node:24-alpine AS binance-home-build
WORKDIR /build/binance-home
ENV VITE_AUTH_ENABLED=false
COPY apps/binance-home/package.json apps/binance-home/package-lock.json ./
RUN npm ci --include=dev
COPY apps/binance-home/ ./
RUN npm run typecheck && npm run build
FROM node:24-alpine AS runtime
RUN apk add --no-cache nginx
COPY hub/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
COPY docker-entrypoint.sh /usr/local/bin/receipts-suite-entrypoint
COPY --from=binance-withdraw-build /build/binance-withdraw/.output/ /opt/receipts/binance-withdraw/
COPY --from=binance-deposit-build /build/binance-deposit/.output/ /opt/receipts/binance-deposit/
COPY --from=crypto-deposit-build /build/crypto-deposit/.output/ /opt/receipts/crypto-deposit/
COPY --from=okx-deposit-build /build/okx-deposit/.output/ /opt/receipts/okx-deposit/
COPY --from=okx-withdraw-build /build/okx-withdraw/.output/ /opt/receipts/okx-withdraw/
COPY --from=binance-home-build /build/binance-home/.output/ /opt/receipts/binance-home/
RUN chmod +x /usr/local/bin/receipts-suite-entrypoint
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
ENTRYPOINT ["/usr/local/bin/receipts-suite-entrypoint"]
