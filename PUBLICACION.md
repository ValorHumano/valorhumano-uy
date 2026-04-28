# Publicacion y configuracion (Vercel + GitHub)

## Arquitectura objetivo

- El sitio se publica en Vercel conectado al repo de GitHub.
- Frontend, formularios y ruta de WhatsApp usan el mismo dominio de Vercel.
- La integracion principal productiva es Vercel (plan gratuito).

## Formularios (incluye Postularme con CV adjunto)

Los formularios se procesan server-side en `/api/forms/:kind`.
El formulario `jobs` envia el CV como adjunto real por SMTP y no usa `mailto`.

Variables requeridas en Vercel:

- `MAIL_FROM`
- `CONTACT_TO`
- `JOBS_TO` opcional, solo como copia secundaria para postulaciones
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`

Notas:

- `jobs` siempre entrega a `seleccionvaloreshumanos@gmail.com` como destinatario principal (`to`).
- Si `JOBS_TO` esta definido, se agrega como copia (`cc`) y nunca reemplaza el Gmail principal.
- La ruta final debe ser `api/forms/[kind].js` porque el handler usa `req.query.kind`.
- Tamano maximo CV: 10 MB.
- Formatos aceptados CV: `.pdf`, `.doc`, `.docx`.

Rutas:

- `POST /api/forms/contact`
- `POST /api/forms/enterprise`
- `POST /api/forms/jobs`

## WhatsApp

Ruta productiva:

- `GET /go/whatsapp`

La ruta redirige via API interna y evita exponer numeros privados en el frontend.

## Privacidad de contacto

No publicar correos ni telefonos sensibles en HTML/JS cliente.
Mantener destinos y credenciales solo en variables privadas de Vercel.

## Deploy gratis con GitHub y Vercel

1. Subir cambios a `main` en GitHub.
2. En Vercel: New Project e importar repo.
3. Configurar variables de entorno indicadas arriba.
4. Deploy.
5. Verificar formulario en produccion con una postulacion real de prueba.
