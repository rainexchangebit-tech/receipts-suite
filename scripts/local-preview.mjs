import { spawn } from "node:child_process";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer, request } from "node:http";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const hubRoot = join(root, "hub");
const port = Number(process.env.PORT || 4173);

const apps = [
  { path: "binance-withdraw", port: 3001 },
  { path: "binance-deposit", port: 3002 },
  { path: "crypto-deposit", port: 3003 },
  { path: "okx-deposit", port: 3004 },
  { path: "okx-withdraw", port: 3005 },
];

const receipts = apps.map(({ path, port: appPort }) =>
  spawn(process.execPath, [join(root, `apps/${path}/.output/server/index.mjs`)], {
    env: {
      ...process.env,
      PORT: String(appPort),
      HOST: "127.0.0.1",
      VITE_AUTH_ENABLED: "false",
    },
    stdio: "inherit",
  }),
);

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = createServer((incoming, outgoing) => {
  const url = new URL(incoming.url || "/", `http://${incoming.headers.host || "localhost"}`);
  const app = apps.find(({ path }) => url.pathname.startsWith(`/${path}/`));
  if (app) {
    const proxied = request(
      {
        hostname: "127.0.0.1",
        port: app.port,
        path: `${url.pathname}${url.search}`,
        method: incoming.method,
        headers: incoming.headers,
      },
      (response) => {
        outgoing.writeHead(response.statusCode || 502, response.headers);
        response.pipe(outgoing);
      },
    );
    proxied.on("error", () => {
      outgoing.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
      outgoing.end("Receipt server is starting. Refresh in a moment.");
    });
    incoming.pipe(proxied);
    return;
  }

  const relative = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\/+/, "");
  const requested = join(hubRoot, relative);
  const file = requested.startsWith(hubRoot) && existsSync(requested) && statSync(requested).isFile()
    ? requested
    : join(hubRoot, "index.html");
  outgoing.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(outgoing);
});

function shutdown() {
  server.close();
  for (const receipt of receipts) receipt.kill("SIGTERM");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
for (const receipt of receipts) {
  receipt.on("exit", (code) => {
    if (code && code !== 0) process.exitCode = code;
  });
}

server.listen(port, "127.0.0.1", () => {
  console.log(`Receipts Suite: http://127.0.0.1:${port}/`);
});
