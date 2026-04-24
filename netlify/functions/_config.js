export function readPrivateValue(key) {
  if (typeof Netlify !== "undefined" && Netlify.env?.get) {
    const value = String(Netlify.env.get(key) || "").trim();
    if (value) return value;
  }

  if (typeof process !== "undefined" && process.env?.[key]) {
    const value = String(process.env[key] || "").trim();
    if (value) return value;
  }

  return "";
}

export function readRequiredPrivateValue(key) {
  const value = readPrivateValue(key);

  if (!value) {
    throw new Error(`Missing configuration: ${key}`);
  }

  return value;
}
