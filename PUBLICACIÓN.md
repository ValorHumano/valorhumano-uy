# Publicacion y configuracion (Vercel + GitHub)

## Arquitectura objetivo

- El sitio se publica en Vercel conectado al repo de GitHub.
- Frontend, formularios y ruta de WhatsApp usan el mismo dominio de Vercel.
- La integracion principal productiva es Vercel (plan gratuito).

## Formularios (incluye "Postularme" con CV adjunto)

Los formularios se procesan server-side en `/api/forms/:kind`.
El formulario `jobs` envia el CV como adjunto real por SMTP (no usa `mailto`).

Variables requeridas en Vercel (Project Settings → Environment Variables):

- `MAIL_FROM` (ejemplo: `seleccionvaloreshumanos@gmail.com`)
- `CONTACT_TO` (ejemplo: `seleccionvaloreshumanos@gmail.com`)
- `JOBS_TO` (opcional; destinatarios en copia para postulación, separados por coma)
- `SMTP_HOST` (para Gmail: `smtp.gmail.com`)
- `SMTP_PORT` (para Gmail TLS STARTTLS: `587`)
- `SMTP_SECURE` (`false` para puerto 587)
- `SMTP_USER` (correo emisor SMTP)
- `SMTP_PASS` (App Password del correo emisor)

Notas:

- `jobs` siempre entrega a `seleccionvaloreshumanos@gmail.com` como destinatario principal (`to`).
- Si `JOBS_TO` está definido, se agrega como copia (`cc`) y nunca reemplaza el Gmail principal.
- Para evitar conflictos entre ramas, mantener este criterio en `api/forms/[kind].js`: Gmail principal fijo para postulación.
- Tamaño máximo CV: 10 MB.
- Formatos aceptados CV: `.pdf`, `.doc`, `.docx`.

Rutas:

- `POST /api/forms/contact`
- `POST /api/forms/enterprise`
- `POST /api/forms/jobs`

## WhatsApp

Ruta productiva:

- `GET /go/whatsapp`

La ruta redirige vía API interna y evita exponer números privados en el frontend.

## Privacidad de contacto

No publicar correos ni teléfonos sensibles en HTML/JS cliente.
Mantener destinos y credenciales solo en variables privadas de Vercel.

## Deploy (gratis con GitHub + Vercel)

1. Subir cambios a `main` en GitHub.
2. En Vercel: **New Project** → importar repo.
3. Configurar variables de entorno indicadas arriba.
4. Deploy.
5. Verificar formulario en producción con una postulación real de prueba.
