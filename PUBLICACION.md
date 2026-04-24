# Publicacion y configuracion

## Arquitectura objetivo

- El sitio debe salir de Netlify como origen principal.
- El frontend, los formularios y la ruta de WhatsApp comparten el mismo origen productivo.
- GitHub Pages queda solo como despliegue manual secundario. Ya no publica automaticamente en cada push.

## Formularios

Los formularios quedaron preparados para envio server-side con SendGrid desde funciones Netlify.

Variables requeridas en Netlify:

- `SENDGRID_API_KEY`
- `VH_MAIL_FROM`
- `VH_MAIL_FROM_NAME`
- `VH_FORWARD_CONTACT`
- `VH_FORWARD_JOBS`

Rutas productivas:

- `POST /api/forms/contact`
- `POST /api/forms/enterprise`
- `POST /api/forms/jobs`

El frontend solo muestra exito cuando el backend responde `ok: true` y el proveedor devuelve un `deliveryId` verificable.

## WhatsApp

La web ya no usa la ruta publica anterior de WhatsApp.

Variable requerida en Netlify:

- `VH_WHATSAPP_NUMBER`

Ruta productiva:

- `GET /go/whatsapp`

La web apunta a esa ruta y el numero queda solo en configuracion privada del servidor.

## Deploy

El workflow principal es `.github/workflows/deploy-netlify.yml`.

Secrets requeridos en GitHub Actions para publicar:

- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

Las variables operativas del sitio no se escriben mas en archivos del repo ni en `private-config.json`.
Se leen solo desde variables privadas del entorno Netlify.

## Regla operativa

No dar por resuelto el funcionamiento productivo mientras falte cualquiera de estas condiciones:

- deploy Netlify exitoso
- variables privadas cargadas en Netlify
- prueba real de `go/whatsapp`
- aceptacion real de SendGrid para los tres formularios
