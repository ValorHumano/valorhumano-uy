import nodemailer from "nodemailer";
import { readPrivateValue, readRequiredPrivateValue } from "./_config.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
  "Cache-Control": "no-store"
};

const subjectByKind = {
  contact: "Nueva consulta desde Valor Humano",
  enterprise: "Nueva consulta de empresa desde Valor Humano",
  jobs: "Nueva postulacion desde Valor Humano"
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
    if (!key || key.startsWith("_") || key === "CV") continue;
    if (typeof value !== "string") continue;

    const normalizedValue = cleanText(value);

    if (!normalizedValue) continue;
    fields[key] = normalizedValue;
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
      ([label, value]) => `<tr><td style="padding:10px 12px;border:1px solid #d8dde3;font-weight:700;color:#20303a;">${escapeHtml(label)}</td><td style="padding:10px 12px;border:1px solid #d8dde3;color:#33424c;">${escapeHtml(value)}</td></tr>`
    )
    .join("");
}

function buildHtml(kind, fields, originPage) {
  const rows = buildRows({
    Formulario: kind,
    "Pagina de origen": originPage,
    ...fields
  });

  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#f3f1eb;font-family:Arial,sans-serif;color:#24323b;">
    <div style="max-width:760px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #d8dde3;">
      <div style="padding:24px 28px;background:#102734;color:#ffffff;">
        <h1 style="margin:0;font-size:24px;line-height:1.2;">Nuevo envio desde Valor Humano</h1>
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
    `Pagina de origen: ${originPage}`,
    ...Object.entries(fields).map(([label, value]) => `${label}: ${value}`)
  ];

  return rows.join("\n");
}

async function buildAttachment(file) {
  const bytes = Buffer.from(await file.arrayBuffer());

  return {
    filename: String(file.name || "cv"),
    content: bytes,
    contentType: getMimeType(file.name, file.type),
    contentDisposition: "attachment"
  };
}

function extractProviderError(error) {
  const rawValue = error?.response || error?.message || error?.cause || "";
  const compact = cleanText(rawValue, 240);
  return compact ? `El proveedor rechazo el envio: ${compact}` : "El proveedor rechazo el envio.";
}

function parsePort(value) {
  const parsed = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(parsed) ? parsed : 587;
}

function buildBrevoTransport() {
  const host = readRequiredPrivateValue("BREVO_SMTP_HOST");
  const port = parsePort(readPrivateValue("BREVO_SMTP_PORT"));
  const user = readRequiredPrivateValue("BREVO_SMTP_LOGIN");
  const pass = readRequiredPrivateValue("BREVO_SMTP_KEY");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass
    }
  });
}

async function sendWithBrevoSmtp({ to, replyTo, subject, html, text, attachment, category }) {
  const fromEmail = readRequiredPrivateValue("VH_MAIL_FROM");
  const fromName = cleanText(readPrivateValue("VH_MAIL_FROM_NAME"), 120) || "Valor Humano";
  const transporter = buildBrevoTransport();

  const payload = {
    from: { name: fromName, address: fromEmail },
    to,
    subject,
    text,
    html,
    headers: {
      "X-ValorHumano-Source": "valorhumano-uy",
      "X-ValorHumano-Form-Kind": category
    }
  };

  if (replyTo && isValidEmail(replyTo)) {
    payload.replyTo = replyTo;
  }

  if (attachment) {
    payload.attachments = [attachment];
  }

  try {
    const result = await transporter.sendMail(payload);
    const deliveryId = cleanText(result?.messageId || result?.response || "", 500);

    if (!deliveryId) {
      throw new Error("El proveedor acepto el envio, pero no devolvio un identificador verificable.");
    }

    return { deliveryId };
  } catch (error) {
    throw new Error(extractProviderError(error));
  }
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
    const delivery = await sendWithBrevoSmtp({
      to: destination,
      replyTo: fields.Correo,
      subject,
      html,
      text,
      attachment,
      category: kind
    });

    return json({ ok: true, provider: "brevo", deliveryId: delivery.deliveryId, message: successByKind[kind] || successByKind.contact });
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
