const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
  "Cache-Control": "no-store"
};

function readEnv(key) {
  if (typeof Netlify !== "undefined" && Netlify.env?.get) {
    return String(Netlify.env.get(key) || "").trim();
  }

  if (typeof process !== "undefined" && process.env?.[key]) {
    return String(process.env[key] || "").trim();
  }

  return "";
}

function getWhatsAppNumber() {
  return readEnv("VH_WHATSAPP_NUMBER").replace(/\D+/g, "");
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response("Método no permitido.", { status: 405, headers: corsHeaders });
  }

  const number = getWhatsAppNumber();

  if (!number) {
    return new Response("El canal de WhatsApp todavía no está configurado.", {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  }

  const url = new URL(req.url);
  const text = url.searchParams.get("text") || "Hola Valor Humano, quiero hacer una consulta.";
  const target = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

  return Response.redirect(target, 302);
};

export const config = {
  path: "/api/whatsapp",
  method: ["GET", "OPTIONS"]
};
