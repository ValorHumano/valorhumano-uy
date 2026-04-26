function getContactTarget(req) {
  const rawText = req.query?.text;
  const text = Array.isArray(rawText) ? rawText[0] : rawText;
  const base = "/contacto/#contacto-form";

  if (!text || typeof text !== "string") return base;

  const params = new URLSearchParams({ motivo: text.slice(0, 240) });
  return `${base}?${params.toString()}`;
}

export default function handler(req, res) {
  const target = getContactTarget(req);

  res.statusCode = 302;
  res.setHeader("Location", target);
  res.setHeader("Cache-Control", "no-store");
  res.end();
}
