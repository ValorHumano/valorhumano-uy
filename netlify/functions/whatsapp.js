import { readPrivateValue } from "./_config.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
  "Cache-Control": "no-store"
};

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response("Metodo no permitido.", { status: 405, headers: corsHeaders });
  }

  const number = readPrivateValue("WHATSAPP_PHONE").replace(/\D+/g, "");
  if (!number) {
    return new Response("Canal no disponible.", { status: 503, headers: corsHeaders });
  }
  const url = new URL(req.url);
  const text = String(url.searchParams.get("text") || "Hola Valor Humano, quiero hacer una consulta.").slice(0, 500);
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
