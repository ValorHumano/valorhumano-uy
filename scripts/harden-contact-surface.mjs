import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const ignored = new Set([".git", "node_modules"]);
const textExtensions = new Set([".html", ".js", ".css", ".json", ".toml", ".yml", ".yaml", ".md", ".txt"]);
const facebookUrl = "https://www.facebook.com/profile.php?id=61572000190463";

function extname(path) {
  const dot = path.lastIndexOf(".");
  return dot >= 0 ? path.slice(dot).toLowerCase() : "";
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (ignored.has(entry)) continue;
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath, files);
    } else if (stats.isFile() && textExtensions.has(extname(fullPath))) {
      files.push(fullPath);
    }
  }
  return files;
}

const replacements = [
  [/mailto:[^\"'\s<>]+/gi, "#formulario-contacto"],
  [/https?:\/\/(?:www\.)?facebook\.com\/(?!profile\.php\?id=61572000190463)[^\"'\s<>]+/gi, facebookUrl],
  [/https?:\/\/(?:wa\.me|api\.whatsapp\.com)\/[^\"'\s<>]+/gi, "/go/whatsapp"],
  [/098803512/g, ""],
  [/59898803512/g, ""],
  [/jhonatan-stemphelet@hotmail\.com/gi, ""],
  [/seleccionvaloreshumanos@gmail\.com/gi, ""],
  [/data-copy-email="[^"]*"/gi, ""],
  [/data-copy-email='[^']*'/gi, ""],
  [/Copiar correo visible/g, "Usar formulario"],
  [/Copiar correo/g, "Usar formulario"],
  [/Correo visible/g, "Formulario directo"],
  [/correo visible/g, "formulario directo"],
  [/Correo general/g, "Formulario general"],
  [/Correo de empleos/g, "Formulario de empleos"],
  [/correo institucional/g, "formulario directo"],
  [/Correo institucional/g, "Formulario directo"],
  [/Correo de contacto/g, "Formulario de contacto"]
];

let changed = 0;

for (const file of walk(root)) {
  let content = readFileSync(file, "utf8");
  const original = content;

  for (const [pattern, value] of replacements) {
    content = content.replace(pattern, value);
  }

  content = content.replace(/<button([^>]*?)type="button"([^>]*?)>\s*Usar formulario\s*<\/button>/gi, "<a$1href=\"#formulario-contacto\"$2>Usar formulario</a>");
  content = content.replace(/<button([^>]*?)type="button"([^>]*?)>\s*Formulario general\s*<\/button>/gi, "<a$1href=\"#formulario-contacto\"$2>Formulario general</a>");
  content = content.replace(/<button([^>]*?)type="button"([^>]*?)>\s*Formulario de empleos\s*<\/button>/gi, "<a$1href=\"empleos/#postularme\"$2>Formulario de empleos</a>");

  if (content !== original) {
    writeFileSync(file, content, "utf8");
    changed += 1;
    console.log(`hardened ${file.replace(`${root}/`, "")}`);
  }
}

console.log(`Hardened contact surface in ${changed} file(s).`);
