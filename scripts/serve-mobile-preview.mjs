import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
const root = resolve("mobile/dist");
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
};
createServer((request, response) => {
  let path;
  try {
    path = resolve(
      root,
      "." + decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname),
    );
  } catch {
    response.writeHead(400).end();
    return;
  }
  if (path !== root && !path.startsWith(root + sep)) {
    response.writeHead(403).end();
    return;
  }
  if (path === root) path = resolve(root, "index.html");
  if (!existsSync(path) || !statSync(path).isFile()) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { "Content-Type": mime[extname(path)] || "application/octet-stream" });
  createReadStream(path).pipe(response);
}).listen(3200, "127.0.0.1", () => console.log("Native web bundle preview: http://127.0.0.1:3200"));
