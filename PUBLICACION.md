# Publicacion y configuracion

## Arquitectura objetivo

- El sitio debe salir de Netlify como origen principal.
- El frontend, los formularios y la ruta de WhatsApp comparten el mismo origen productivo.
- GitHub Pages queda solo como despliegue estatico secundario. No debe operar contacto, formularios ni WhatsApp.

## Formularios

Los formularios quedaron preparados para envio server-side con SendGrid desde funciones Netlify.

Variables requeridas en Netlify:

- `SENDGRID_API_KEY`
- `VH_MAIL_FROM`
- `VH_MAIL_FROM_NAME`
- `VH_FORWARD_CONTACT`
- `VH_FORWARD_JOBS`

El formulario de empleos envia el CV como adjunto real desde la funcion server-side.
No depende de `mailto`, del cliente de correo del usuario ni de cargas manuales fuera del sitio.

Rutas productivas:

- `POST /api/forms/contact`
- `POST /api/forms/enterprise`
- `POST /api/forms/jobs`

El frontend solo muestra exito cuando el backend responde `ok: true` y el proveedor devuelve un `deliveryId` verificable.

## WhatsApp

Variable requerida en Netlify:

- `VH_WHATSAPP_NUMBER`

Ruta productiva:

- `GET /go/whatsapp`

La web apunta a esa ruta y el numero queda solo en configuracion privada del servidor.

## Privacidad de contacto

No quedan visibles en frontend:

- el numero real de WhatsApp
- el Hotmail de recepcion comercial
- el Gmail de recepcion de postulaciones

El sitio ya no muestra alias de correo no operativos del dominio. El contacto visible para usuarios se resuelve con formularios, WhatsApp y redes oficiales.

## Deploy

El workflow principal es `.github/workflows/deploy-netlify.yml`.

Secrets requeridos en GitHub Actions para publicar:

- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

Las variables operativas del sitio no se escriben en archivos del repo.
Se leen solo desde variables privadas del entorno Netlify.
