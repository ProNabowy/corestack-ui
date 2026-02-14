const fs = require("fs");
const path = require("path");

const srcPath = path.resolve(__dirname, "..", "src", "styles", "index.css");
const distPath = path.resolve(__dirname, "..", "dist", "index.css");

fs.mkdirSync(path.dirname(distPath), { recursive: true });
fs.copyFileSync(srcPath, distPath);
