const defaultMessage = "Hola Valor Humano, quiero hacer una consulta.";

function getPhone() {
  const phone = process.env.WHATSAPP_PHONE;
  if (!phone) throw new Error("Missing required private environment variable: WHATSAPP_PHONE");
  return phone.replace(/\D/g, "");
}

function getMessage(req) {
  const raw = req.query?.text;
  if (Array.isArray(raw)) return raw[0] || defaultMessage;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return defaultMessage;
}

export default function handler(req, res) {
  try {
    const phone = getPhone();
    const message = getMessage(req);
    const target = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    res.statusCode = 302;
    res.setHeader("Location", target);
    res.setHeader("Cache-Control", "no-store");
    res.end();
  } catch (error) {
    console.error("Valor Humano WhatsApp redirect failed", {
      message: error?.message
    });

    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end("No se pudo abrir WhatsApp en este momento. Proba nuevamente mas tarde.");
  }
}
