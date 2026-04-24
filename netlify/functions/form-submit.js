import { readPrivateValue, readRequiredPrivateValue } from "./_config.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
  "Cache-Control": "no-store"
};

const publicAliasByKind = {
  contact: "contacto@valorhumano.com.uy",
  enterprise: "contacto@valorhumano.com.uy",
  jobs: "seleccion@valorhumano.com.uy"
};

const subjectByKind = {
  contact: "Nueva consulta desde valorhumano.com.uy",
  enterprise: "Nueva consulta empresa desde valorhumano.com.uy",
  jobs: "Nueva postulacion desde valorhumano.com.uy"
};

const successByKind = {
  contact: "Tu consulta fue enviada correctamente. En breve seguimos el contacto.",
  enterprise: "Tu consulta fue enviada correctamente. En breve seguimos el contacto.",
  jobs: "Tu postulacion fue enviada correctamente. En breve seguimos el contacto."
};

const destinationByKind = {
  contact: "VH_FORWARD_CONTACT",
  enterprise: "VH_FORWARD_CONTACT",
  jobs: "VH_FORWARD_JOBS"
};

const requiredFieldsByKind = {
  contact: ["Nombre", "Telefono", "Correo", "Mensaje"],
  enterprise: ["Nombre y apellido", "Empresa", "Telefono", "Correo", "Servicio de interes", "Mensaje"],
  jobs: ["Nombre y apellido", "Telefono", "Correo"]
};

const nameAliases = new Map([
  ["Teléfono", "Telefono"],
  ["Servicio de interés", "Servicio de interes"]
]);

const allowedCvExtensions = [".pdf", ".doc", ".docx"];
const maxCvSizeBytes = 10 * 1024 * 1024;

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

function normalizeKind(kind) {
  return Object.prototype.hasOwnProperty.call(destinationByKind, kind) ? kind : "";
}

function normalizeFieldName(key) {
  return key;
}

function cleanText(value, maxLength = 4000) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getDestination(kind) {
  return readRequiredPrivateValue(destinationByKind[kind]);
}

function getMimeType(fileName, explicitType) {
  if (explicitType) return explicitType;

  const lowerName = String(fileName || "").toLowerCase();

  if (lowerName.endsWith(".pdf")) return "application/pdf";
  if (lowerName.endsWith(".doc")) return "application/msword";
  if (lowerName.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  return "application/octet-stream";
}

function validateCv(file) {
  if (!file || !file.name) {
    return { valid: false, message: "Adjunta tu CV para completar la postulacion." };
  }

  const lowerName = String(file.name || "").toLowerCase();
  const hasValidExtension = allowedCvExtensions.some((extension) => lowerName.endsWith(extension));

  if (!hasValidExtension) {
    return { valid: false, message: "El CV debe estar en formato PDF, DOC o DOCX." };
  }

  if (Number(file.size || 0) > maxCvSizeBytes) {
    return { valid: false, message: "El archivo supera el maximo de 10 MB permitido." };
  }

  return { valid: true };
}

function buildFieldMap(formData) {
  const fields = {};

  for (const [key, value] of formData.entries()) {
    if (!key || key.startsWith("_")) continue;
    if (typeof value !== "string") continue;

    const normalizedKey = normalizeFieldName(key);
    const normalizedValue = cleanText(value);

    if (!normalizedValue) continue;
    fields[normalizedKey] = normalizedValue;
  }

  return fields;
}

function validateFields(kind, fields) {
  const requiredFields = requiredFieldsByKind[kind] || [];

  for (const key of requiredFields) {
    if (!cleanText(fields[key])) {
      return { valid: false, message: "Completa los campos requeridos antes de enviar el formulario." };
    }
  }

  if (!isValidEmail(fields.Correo || "")) {
    return { valid: false, message: "Ingresa un correo valido para continuar." };
  }

  return { valid: true };
}

function buildRows(fields) {
  return Object.entries(fields)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:10px 12px;border:1px solid #d8dde3;font-weight:700;color:#20303a;">${escapeHtml(label)}</td><td style="padding:10px 12px;border:1px solid #d8dde3;color:#33424c;">${escapeHtml(value)}</td></tr>`
    )
    .join("");
}

function buildHtml(kind, fields, originPage) {
  const rows = buildRows({
    "Formulario": kind,
    "Canal visible al usuario": publicAliasByKind[kind],
    "Pagina de origen": originPage,
    ...fields
  });

  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#f3f1eb;font-family:Arial,sans-serif;color:#24323b;">
    <div style="max-width:760px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #d8dde3;">
      <div style="padding:24px 28px;background:#102734;color:#ffffff;">
        <h1 style="margin:0;font-size:24px;line-height:1.2;">Nuevo envio desde valorhumano.com.uy</h1>
      </div>
      <div style="padding:24px 28px;">
        <p style="margin:0 0 18px;line-height:1.6;">El proveedor acepto un nuevo formulario y lo dejo registrado para seguimiento.</p>
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
      </div>
    </div>
  </body>
</html>`;
}

function buildText(kind, fields, originPage) {
  const rows = [
    `Formulario: ${kind}`,
    `Canal visible al usuario: ${publicAliasByKind[kind]}`,
    `Pagina de origen: ${originPage}`,
    ...Object.entries(fields).map(([label, value]) => `${label}: ${value}`)
  ];

  return rows.join("\n");
}

async function buildAttachment(file) {
  const bytes = await file.arrayBuffer();

  return {
    content: Buffer.from(bytes).toString("base64"),
    filename: String(file.name || "cv"),
    type: getMimeType(file.name, file.type),
    disposition: "attachment"
  };
}

function extractProviderError(rawBody) {
  if (!rawBody) return "El proveedor rechazo el envio.";

  try {
    const parsed = JSON.parse(rawBody);
    const firstError = parsed?.errors?.[0];
    const providerMessage = cleanText(firstError?.message || "", 240);

    if (providerMessage) return `El proveedor rechazo el envio: ${providerMessage}`;
  } catch (error) {
    const compact = cleanText(rawBody, 240);
    if (compact) return `El proveedor rechazo el envio: ${compact}`;
  }

  return "El proveedor rechazo el envio.";
}

async function sendWithSendGrid({ to, replyTo, subject, html, text, attachment, category }) {
  const apiKey = readRequiredPrivateValue("SENDGRID_API_KEY");
  const fromEmail = readRequiredPrivateValue("VH_MAIL_FROM");
  const fromName = cleanText(readPrivateValue("VH_MAIL_FROM_NAME"), 120) || "Valor Humano";

  const payload = {
    personalizations: [
      {
        to: [{ email: to }],
        subject
      }
    ],
    from: {
      email: fromEmail,
      name: fromName
    },
    content: [
      {
        type: "text/plain",
        value: text
      },
      {
        type: "text/html",
        value: html
      }
    ],
    custom_args: {
      source: "valorhumano-uy",
      form_kind: category
    }
  };

  if (replyTo && isValidEmail(replyTo)) {
    payload.reply_to = { email: replyTo };
  }

  if (attachment) {
    payload.attachments = [attachment];
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const rawBody = await response.text();
  const deliveryId = response.headers.get("x-message-id") || response.headers.get("x-request-id") || "";

  if (response.status !== 202) {
    throw new Error(extractProviderError(rawBody));
  }

  if (!deliveryId) {
    throw new Error("El proveedor acepto el envio, pero no devolvio un identificador verificable.");
  }

  return {
    deliveryId
  };
}

export default async (req, context) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ ok: false, message: "Metodo no permitido." }, 405);
  }

  const kind = normalizeKind(context.params?.kind || "");

  if (!kind) {
    return json({ ok: false, message: "Formulario no reconocido." }, 404);
  }

  try {
    const incoming = await req.formData();
    const fields = buildFieldMap(incoming);
    const validation = validateFields(kind, fields);

    if (!validation.valid) {
      return json({ ok: false, message: validation.message }, 400);
    }

    let attachment = null;

    if (kind === "jobs") {
      const cvFile = incoming.get("CV");
      const cvValidation = validateCv(cvFile);

      if (!cvValidation.valid) {
        return json({ ok: false, message: cvValidation.message }, 400);
      }

      attachment = await buildAttachment(cvFile);
    }

    const originPage = cleanText(incoming.get("_page"), 500) || "No disponible";
    const subject = subjectByKind[kind] || subjectByKind.contact;
    const destination = getDestination(kind);
    const html = buildHtml(kind, fields, originPage);
    const text = buildText(kind, fields, originPage);
    const delivery = await sendWithSendGrid({
      to: destination,
      replyTo: fields.Correo,
      subject,
      html,
      text,
      attachment,
      category: kind
    });

    return json({
      ok: true,
      provider: "sendgrid",
      deliveryId: delivery.deliveryId,
      message: successByKind[kind] || successByKind.contact
    });
  } catch (error) {
    if (String(error?.message || "").startsWith("Missing configuration:")) {
      return json({ ok: false, message: "El formulario todavia no esta configurado en produccion." }, 503);
    }

    return json({ ok: false, message: error?.message || "No se pudo procesar la consulta en este momento." }, 502);
  }
};

export const config = {
  path: "/api/forms/:kind",
  method: ["POST", "OPTIONS"]
};
