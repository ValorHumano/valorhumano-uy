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

export function readAlternativePrivateValue(...keys) {
  for (const key of keys) {
    const value = readPrivateValue(key);
    if (value) return value;
  }
  return "";
}

export function readRequiredPrivateValue(...keys) {
  const value = readAlternativePrivateValue(...keys);

  if (!value) {
    throw new Error(`Missing configuration: ${keys.join(" or ")}`);
  }

  return value;
}
