export default function handler(req, res) {
  const phone = String(process.env.WHATSAPP_PHONE || "").replace(/\D+/g, "");
  if (!phone) {
    res.statusCode = 503;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Canal no disponible.");
    return;
  }

  const textRaw = Array.isArray(req.query?.text) ? req.query.text[0] : req.query?.text;
  const text = String(textRaw || "Hola Valor Humano, quiero hacer una consulta.").slice(0, 500);
  const target = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  res.statusCode = 302;
  res.setHeader("Location", target);
  res.setHeader("Cache-Control", "no-store");
  res.end();
}
