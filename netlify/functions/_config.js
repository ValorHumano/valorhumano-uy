import fs from "node:fs";

let fileCache;

function readFileConfig() {
  if (fileCache) return fileCache;

  try {
    const configUrl = new URL("./private-config.json", import.meta.url);
    const raw = fs.readFileSync(configUrl, "utf8");
    fileCache = JSON.parse(raw);
  } catch (error) {
    fileCache = {};
  }

  return fileCache;
}

export function readPrivateValue(key) {
  if (typeof Netlify !== "undefined" && Netlify.env?.get) {
    const value = String(Netlify.env.get(key) || "").trim();
    if (value) return value;
  }

  if (typeof process !== "undefined" && process.env?.[key]) {
    const value = String(process.env[key] || "").trim();
    if (value) return value;
  }

  const fileConfig = readFileConfig();
  return String(fileConfig[key] || "").trim();
}
