function getWhatsAppTarget(req) {
  const rawText = req.query?.text;
  const text = Array.isArray(rawText) ? rawText[0] : rawText;
  const message = typeof text === "string" && text.trim() ? text.trim().slice(0, 240) : "";
  const rawPhone = process.env.WHATSAPP_PHONE || "";
  const phone = String(rawPhone).replace(/\D/g, "");

  if (!phone) {
    throw new Error("Missing WhatsApp configuration");
  }

  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${phone}${query}`;
}

export default function handler(req, res) {
  try {
    const target = getWhatsAppTarget(req);
    res.statusCode = 302;
    res.setHeader("Location", target);
    res.setHeader("Cache-Control", "no-store");
    res.end();
  } catch (error) {
    console.error("WhatsApp redirect failed", { message: error?.message });
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify({ ok: false, message: "No se pudo iniciar el chat. Volvé a intentarlo en un momento." }));
  }
}
