const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
  "Cache-Control": "no-store"
};

const subjectByKind = {
  contact: "Nueva consulta desde valorhumano.com.uy",
  enterprise: "Nueva consulta empresa desde valorhumano.com.uy",
  jobs: "Nueva postulacion desde valorhumano.com.uy"
};

const successByKind = {
  contact: "Tu consulta fue enviada correctamente. En breve seguimos el contacto.",
  enterprise: "Tu consulta fue enviada correctamente. En breve seguimos el contacto.",
  jobs: "Tu postulación fue enviada correctamente. En breve seguimos el contacto."
};

const destinationByKind = {
  contact: "VH_FORWARD_CONTACT",
  enterprise: "VH_FORWARD_CONTACT",
  jobs: "VH_FORWARD_JOBS"
};

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

function readEnv(key) {
  if (typeof Netlify !== "undefined" && Netlify.env?.get) {
    return String(Netlify.env.get(key) || "").trim();
  }

  if (typeof process !== "undefined" && process.env?.[key]) {
    return String(process.env[key] || "").trim();
  }

  return "";
}

function getDestination(kind) {
  const key = destinationByKind[kind];
  if (!key) return "";
  return readEnv(key);
}

export default async (req, context) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ ok: false, message: "Método no permitido." }, 405);
  }

  const kind = context.params?.kind || "contact";
  const destination = getDestination(kind);

  if (!destination) {
    return json({ ok: false, message: "El canal todavía no está configurado." }, 500);
  }

  try {
    const incoming = await req.formData();
    const relay = new FormData();

    for (const [key, value] of incoming.entries()) {
      if (!key || key.startsWith("_")) continue;
      relay.append(key, value);
    }

    relay.append("_captcha", "false");
    relay.append("_template", "table");
    relay.append("_subject", String(incoming.get("_subject") || subjectByKind[kind] || subjectByKind.contact));

    const visibleContact = String(incoming.get("_visible_contact") || "");
    const page = String(incoming.get("_page") || "");
    const replyTo = String(incoming.get("Correo") || "");

    if (replyTo) relay.append("_replyto", replyTo);
    if (visibleContact) relay.append("Canal visible", visibleContact);
    if (page) relay.append("Página de origen", page);

    const response = await fetch(`https://formsubmit.co/${encodeURIComponent(destination)}`, {
      method: "POST",
      body: relay,
      redirect: "follow",
      headers: {
        Accept: "text/html"
      }
    });

    if (!response.ok) {
      return json({ ok: false, message: "No se pudo enviar la consulta en este momento." }, 502);
    }

    return json({
      ok: true,
      message: successByKind[kind] || successByKind.contact
    });
  } catch (error) {
    return json({ ok: false, message: "No se pudo procesar la consulta en este momento." }, 500);
  }
};

export const config = {
  path: "/api/form-submit/:kind",
  method: ["POST", "OPTIONS"]
};
