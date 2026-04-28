import formidable from "formidable";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: false
  }
};

const safeSuccess = "Tu mensaje fue enviado correctamente. En breve seguimos el contacto.";
const safeError = "No se pudo enviar el mensaje en este momento. Probá nuevamente más tarde.";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function getEnvValue(...names) {
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function getRequiredEnv(...names) {
  const value = getEnvValue(...names);
  if (!value) throw new Error(`Missing required private environment variable: ${names.join(" or ")}`);
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

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON payload"));
      }
    });
    req.on("error", reject);
  });
}

function parseForm(req) {
  const form = formidable({ multiples: false, keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields) => {
      if (error) reject(error);
      else resolve(normalizeFields(fields));
    });
  });
}

async function parseRequest(req) {
  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  if (contentType.includes("application/json")) {
    const body = await parseJsonBody(req);
    return normalizeFields(body);
  }
  return parseForm(req);
}

function validatePayload(fields) {
  const nombre = fields.Nombre;
  const telefono = fields.Telefono;
  const correo = fields.Correo;
  const mensaje = fields.Mensaje;

  if (!nombre) return "Completa tu nombre para enviar la consulta.";
  if (!mensaje) return "Agrega un mensaje para que podamos responder tu consulta.";
  if (!telefono && !correo) return "Dejá al menos tu teléfono o tu correo para que podamos responderte.";
  return null;
}

function buildPlainText(fields, pageUrl, timestamp) {
  return [
    "Chat web Valor Humano",
    "Fuente: Chat web Valor Humano",
    "",
    `Nombre: ${fields.Nombre || "-"}`,
    `Teléfono: ${fields.Telefono || "-"}`,
    `Correo: ${fields.Correo || "-"}`,
    "",
    `Mensaje: ${fields.Mensaje || "-"}`,
    "",
    `Página: ${pageUrl}`,
    `Fecha: ${timestamp}`
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

function buildHtml(fields, pageUrl, timestamp) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#222;">
      <h2>Chat web Valor Humano</h2>
      <p><strong>Fuente:</strong> Chat web Valor Humano</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px;">
        <tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd;">Nombre</th><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(fields.Nombre || "-")}</td></tr>
        <tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd;">Teléfono</th><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(fields.Telefono || "-")}</td></tr>
        <tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd;">Correo</th><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(fields.Correo || "-")}</td></tr>
        <tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd;">Mensaje</th><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(fields.Mensaje || "-")}</td></tr>
        <tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd;">Página</th><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(pageUrl)}</td></tr>
        <tr><th align="left" style="padding:8px;border-bottom:1px solid #ddd;">Fecha</th><td style="padding:8px;border-bottom:1px solid #ddd;">${escapeHtml(timestamp)}</td></tr>
      </table>
    </div>
  `;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: getRequiredEnv("SMTP_HOST", "BREVO_SMTP_HOST"),
    port: Number(process.env.SMTP_PORT || process.env.BREVO_SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || process.env.BREVO_SMTP_SECURE || "false") === "true",
    auth: {
      user: getRequiredEnv("SMTP_USER", "BREVO_SMTP_LOGIN"),
      pass: getRequiredEnv("SMTP_PASS", "BREVO_SMTP_KEY")
    }
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { ok: false, message: safeError });
  }

  try {
    const fields = await parseRequest(req);
    const validation = validatePayload(fields);
    if (validation) return sendJson(res, 400, { ok: false, message: validation });

    const pageUrl = fields._page || req.headers.referer || "Sitio web Valor Humano";
    const timestamp = new Date().toISOString();
    const transporter = createTransporter();

    await transporter.sendMail({
      from: getRequiredEnv("MAIL_FROM", "VH_MAIL_FROM"),
      to: getRequiredEnv("CONTACT_TO", "VH_FORWARD_CONTACT"),
      replyTo: fields.Correo || undefined,
      subject: "[Valor Humano] Chat web / Consulta rápida",
      text: buildPlainText(fields, pageUrl, timestamp),
      html: buildHtml(fields, pageUrl, timestamp)
    });

    return sendJson(res, 200, {
      ok: true,
      message: safeSuccess
    });
  } catch (error) {
    console.error("Valor Humano chat delivery failed", {
      message: error?.message,
      code: error?.code
    });
    return sendJson(res, 500, { ok: false, message: safeError });
  }
}
