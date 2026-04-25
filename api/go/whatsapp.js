const defaultMessage = "Hola Valor Humano, quiero hacer una consulta.";

function getPhone() {
  return (process.env.WHATSAPP_PHONE || "59898803512").replace(/\D/g, "");
}

function getMessage(req) {
  const raw = req.query?.text;
  if (Array.isArray(raw)) return raw[0] || defaultMessage;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return defaultMessage;
}

export default function handler(req, res) {
  const phone = getPhone();
  const message = getMessage(req);
  const target = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  res.statusCode = 302;
  res.setHeader("Location", target);
  res.end();
}
