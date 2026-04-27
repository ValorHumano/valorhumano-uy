import path from "node:path";
import formidable from "formidable";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false
  }
};

const allowedKinds = new Set(["contact", "enterprise", "jobs"]);
const allowedCvExtensions = new Set([".pdf", ".doc", ".docx"]);
const maxCvSizeBytes = 10 * 1024 * 1024;

const labelsByKind = {
  contact: "Consulta desde Contacto",
  enterprise: "Consulta de Empresa",
  jobs: "Postulación con CV"
};

const successMessages = {
  contact: "Tu consulta fue enviada correctamente. En breve seguimos el contacto.",
  enterprise: "Tu consulta fue enviada correctamente. En breve seguimos el contacto.",
  jobs: "Tu postulación fue enviada correctamente. En breve seguimos el contacto."
};

const safeFormError = "No se pudo enviar el formulario en este momento. Probá nuevamente más tarde.";

const requiredFieldsByKind = {
  contact: ["Nombre", "Telefono", "Correo", "Motivo", "Mensaje"],
  enterprise: ["Nombre y apellido", "Empresa", "Telefono", "Correo", "Servicio de interes", "Ubicacion o rubro", "Mensaje"],
  jobs: ["Nombre y apellido", "Telefono", "Correo"]
};

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required private environment variable: ${name}`);
  return value;
}

function normalizeValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (typeof value === "string") return value.trim();
  return value == null ? "" : String(value).trim();
}

function normalizeFields(fields) {
  return Object.fromEntries(
    Object.entries(fields || {}).map(([key, value]) => [key, normalizeValue(value)])
  );
}

function getUploadedFile(files) {
  const raw = files?.CV || files?.cv || files?.archivo || files?.file;
  if (Array.isArray(raw)) return raw[0] || null;
  return raw || null;
}

function parseRequest(req) {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
    maxFileSize: maxCvSizeBytes,
    maxTotalFileSize: maxCvSizeBytes + 1024 * 1024
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      else resolve({ fields: normalizeFields(fields), files });
    });
  });
}

function validateKind(kind) {
  if (!allowedKinds.has(kind)) return "El tipo de formulario no es valido.";
  return null;
}

function validateRequired(fields, names) {
  const missing = names.filter((name) => !fields[name]);
  if (missing.length) return `Faltan datos obligatorios: ${missing.join(", ")}.`;
  return null;
}

function validateCv(file) {
  if (!file) return "Adjunta tu CV para completar la postulacion.";

  const originalName = file.originalFilename || file.newFilename || "cv";
  const extension = path.extname(originalName).toLowerCase();

  if (!allowedCvExtensions.has(extension)) return "El CV debe estar en formato PDF, DOC o DOCX.";
  if (file.size > maxCvSizeBytes) return "El archivo supera el maximo de 10 MB permitido.";

  return null;
}

function validatePayload(kind, fields, files) {
  const kindError = validateKind(kind);
  if (kindError) return kindError;

  const requiredError = validateRequired(fields, requiredFieldsByKind[kind] || []);
  if (requiredError) return requiredError;

  if (kind === "jobs") return validateCv(getUploadedFile(files));
  return null;
}

function getRecipient(kind) {
  if (kind === "jobs") return getRequiredEnv("JOBS_TO");
  return getRequiredEnv("CONTACT_TO");
}

function buildPlainText(kind, fields) {
  return [
    labelsByKind[kind],
    "Fuente: Formulario web Valor Humano",
    "",
    ...Object.entries(fields).map(([key, value]) => `${key}: ${value || "-"}`),
    "",
    "Enviado desde el sitio web de Valor Humano."
  ].join("\n");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildHtml(kind, fields) {
  const rows = Object.entries(fields)
    .map(([key, value]) => `<tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(key)}</th><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(value || "-")}</td></tr>`)
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#222;">
      <h2>${escapeHtml(labelsByKind[kind])}</h2>
      <p><strong>Fuente:</strong> Formulario web Valor Humano</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px;">${rows}</table>
      <p style="margin-top:18px;color:#666;">Enviado desde el sitio web de Valor Humano.</p>
    </div>
  `;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: getRequiredEnv("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: getRequiredEnv("SMTP_USER"),
      pass: getRequiredEnv("SMTP_PASS")
    }
  });
}

function buildAttachments(kind, files) {
  if (kind !== "jobs") return [];

  const cv = getUploadedFile(files);
  if (!cv) return [];

  return [
    {
      filename: cv.originalFilename || "CV",
      path: cv.filepath,
      contentType: cv.mimetype || undefined
    }
  ];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { ok: false, message: "Metodo no permitido." });
  }

  const kind = normalizeValue(req.query.kind || "");

  try {
    const { fields, files } = await parseRequest(req);
    const pageUrl = fields._page || req.headers.referer || "Sitio web Valor Humano";
    const timestamp = new Date().toISOString();
    fields.Pagina = fields.Pagina || pageUrl;
    fields["Fecha/hora"] = fields["Fecha/hora"] || timestamp;
    const payloadError = validatePayload(kind, fields, files);

    if (payloadError) return sendJson(res, 400, { ok: false, message: payloadError });

    const transporter = createTransporter();
    const replyTo = fields.Correo || undefined;
    const subject = `[Valor Humano] ${labelsByKind[kind]}`;
    const attachments = buildAttachments(kind, files);

    if (kind === "jobs") {
      const cv = getUploadedFile(files);
      console.info("jobs route reached", {
        kind,
        route: "/api/forms/jobs",
        destinationKind: "JOBS_TO",
        hasJobsTo: Boolean(process.env.JOBS_TO),
        hasContactTo: Boolean(process.env.CONTACT_TO),
        hasCv: Boolean(cv),
        cvName: cv?.originalFilename || cv?.newFilename || null,
        cvSize: cv?.size || null,
        cvPathPresent: Boolean(cv?.filepath),
        attachmentCount: attachments.length
      });
    }

    const info = await transporter.sendMail({
      from: getRequiredEnv("MAIL_FROM"),
      to: getRecipient(kind),
      replyTo,
      subject,
      text: buildPlainText(kind, fields),
      html: buildHtml(kind, fields),
      attachments
    });

    const acceptedCount = info.accepted?.length || 0;
    const rejectedCount = info.rejected?.length || 0;
    if (acceptedCount < 1 || rejectedCount > 0) {
      throw new Error("Mail delivery was not accepted by provider.");
    }

    if (kind === "jobs") {
      console.info("jobs mail result", {
        destinationKind: "JOBS_TO",
        acceptedCount,
        rejectedCount,
        messageId: info.messageId || null
      });
      if (acceptedCount < 1 || rejectedCount > 0) {
        throw new Error("Jobs delivery was not accepted by provider.");
      }
    }

    return sendJson(res, 200, {
      ok: true,
      message: successMessages[kind],
      deliveryId: info.messageId || info.response || "sent"
    });
  } catch (error) {
    if (kind === "jobs") {
      console.error("jobs mail failed", {
        destinationKind: "JOBS_TO",
        message: error?.message,
        code: error?.code,
        command: error?.command
      });
    }
    console.error("Valor Humano form delivery failed", {
      kind,
      message: error?.message,
      code: error?.code,
      command: error?.command
    });

    return sendJson(res, 500, {
      ok: false,
      message: safeFormError
    });
  }
}
