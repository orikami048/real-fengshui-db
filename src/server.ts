import http from "http";
import fs from "fs";
import path from "path";

const PORT = 3000;
const PUBLIC_DIR = path.resolve(__dirname, "..");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  let reqPath = req.url?.split("?")[0] || "/";
  if (reqPath === "/") reqPath = "/index.html";

  const filePath = path.join(PUBLIC_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`☯️  Real Feng Shui Master 可视化交互工作台已就绪！`);
  console.log(`🌐 本地浏览器访问地址: http://localhost:${PORT}`);
  console.log(`📂 也可直接在文件管理器中双击打开 index.html 体验！`);
  console.log(`=======================================================`);
});
