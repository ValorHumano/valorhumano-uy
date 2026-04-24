import { readPrivateValue } from "./_config.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
  "Cache-Control": "no-store"
};

function getWhatsAppNumber() {
  return readPrivateValue("VH_WHATSAPP_NUMBER").replace(/\D+/g, "");
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response("Metodo no permitido.", { status: 405, headers: corsHeaders });
  }

  const number = getWhatsAppNumber();

  if (!number) {
    return new Response("El canal de WhatsApp todavia no esta configurado.", {
      status: 503,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  }

  const url = new URL(req.url);
  const text = String(url.searchParams.get("text") || "Hola Valor Humano, quiero hacer una consulta.")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
  const target = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

  return new Response(null, {
    status: 302,
    headers: {
      ...corsHeaders,
      Location: target
    }
  });
};

export const config = {
  path: "/go/whatsapp",
  method: ["GET", "OPTIONS"]
};
