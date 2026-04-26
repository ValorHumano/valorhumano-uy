function getContactTarget(req) {
  const rawText = req.query?.text;
  const text = Array.isArray(rawText) ? rawText[0] : rawText;
  const params = new URLSearchParams();

  if (typeof text === "string" && text.trim()) {
    params.set("motivo", text.trim().slice(0, 240));
  }

  const query = params.toString();
  return `/contacto/${query ? `?${query}` : ""}#formulario-contacto`;
}

export default function handler(req, res) {
  const target = getContactTarget(req);

  res.statusCode = 302;
  res.setHeader("Location", target);
  res.setHeader("Cache-Control", "no-store");
  res.end();
}
