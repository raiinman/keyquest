import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";
const LEDGER = path.join(__dirname, "recovery-ledger.jsonl");
const KQ_PREFIX = "https://images.neopets.com/";

function ledger(entry) {
  const row = JSON.stringify({ ts: new Date().toISOString(), ...entry });
  fs.appendFileSync(LEDGER, row + "\n", "utf8");
  console.log(row);
}

function send(res, code, body, headers = {}) {
  res.writeHead(code, {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...headers,
  });
  res.end(body);
}

async function proxyNeopets(req, res, pathname, search) {
  if (!["GET", "HEAD"].includes(req.method || "")) {
    ledger({ kind: "blocked-write", method: req.method, path: pathname });
    return send(res, 405, "Read-only recovery harness: write methods are blocked.\n", {
      "Content-Type": "text/plain; charset=utf-8",
    });
  }

  const relative = pathname.slice("/neo/".length);
  const target = new URL(relative + search, KQ_PREFIX);

  if (target.origin !== "https://images.neopets.com") {
    ledger({ kind: "blocked-origin", target: target.href });
    return send(res, 403, "Blocked origin.\n", {
      "Content-Type": "text/plain; charset=utf-8",
    });
  }

  const started = Date.now();
  try {
    const upstream = await fetch(target, {
      method: req.method,
      redirect: "follow",
      headers: {
        "User-Agent": "KeyQuest-Recovery-Harness/0.1 (read-only archival compatibility test)",
        "Accept": "*/*",
      },
    });

    const buf = req.method === "HEAD" ? null : Buffer.from(await upstream.arrayBuffer());
    const type = upstream.headers.get("content-type") || "application/octet-stream";

    ledger({
      kind: "fetch",
      method: req.method,
      target: target.href,
      status: upstream.status,
      contentType: type,
      bytes: buf?.byteLength ?? 0,
      ms: Date.now() - started,
    });

    const headers = {
      "Content-Type": type,
      "Access-Control-Allow-Origin": "*",
    };
    const len = upstream.headers.get("content-length");
    if (len) headers["Content-Length"] = len;

    res.writeHead(upstream.status, headers);
    if (buf) res.end(buf);
    else res.end();
  } catch (err) {
    ledger({
      kind: "fetch-error",
      target: target.href,
      error: String(err),
      ms: Date.now() - started,
    });
    send(res, 502, `Proxy fetch failed: ${err}\n`, {
      "Content-Type": "text/plain; charset=utf-8",
    });
  }
}

function staticFile(req, res, pathname) {
  if (pathname === "/") pathname = "/index.html";
  const file = path.normalize(path.join(__dirname, pathname));
  if (!file.startsWith(__dirname)) return send(res, 403, "Forbidden\n");
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    return send(res, 404, "Not found\n");
  }

  const ext = path.extname(file).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".jsonl": "application/x-ndjson; charset=utf-8",
  };
  send(res, 200, fs.readFileSync(file), {
    "Content-Type": types[ext] || "application/octet-stream",
  });
}

http.createServer(async (req, res) => {
  const u = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  if (u.pathname.startsWith("/neo/")) {
    await proxyNeopets(req, res, u.pathname, u.search);
    return;
  }
  staticFile(req, res, u.pathname);
}).listen(PORT, HOST, () => {
  console.log(`Key Quest recovery harness listening on ${HOST}:${PORT}`);
  console.log("READ-ONLY: only GET/HEAD requests to images.neopets.com are proxied.");
  console.log(`Ledger: ${LEDGER}`);
});
