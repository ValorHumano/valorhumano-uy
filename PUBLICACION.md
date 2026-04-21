# Publicacion final

## Estado del entregable

- El sitio quedo resuelto como estatico multipagina, con rutas limpias y sin dependencia de previews temporales.
- La fuente unica del sitio es `render-site.ps1`.
- El workflow de GitHub Pages en [deploy-pages.yml](/C:/Users/jhona/Downloads/valor_humano_updated/.github/workflows/deploy-pages.yml:1) ahora ejecuta la regeneracion del sitio antes de publicar.
- `robots.txt` tambien queda incluido en la salida.

## Rutas listas para publicacion

- `/`
- `/nosotros/`
- `/seleccion-de-personal/`
- `/tercerizacion-de-personal/`
- `/payroll/`
- `/asesoramiento-logistico/`
- `/empresas/`
- `/empleos/`
- `/contacto/`

## URL limpia recomendada

Mientras no exista dominio propio, la salida mas limpia y estable para este proyecto es GitHub Pages con un repo llamado `valorhumano-uy`.

Formato recomendado:

- `https://TU-USUARIO.github.io/valorhumano-uy/`

Cuando exista dominio propio:

- `https://www.valorhumano.com.uy`
- `https://valorhumano.com.uy`

## Lo honesto sobre la publicacion desde este entorno

En esta carpeta no hay un repositorio Git activo ni tooling autenticado de deploy disponible (`gh` y `netlify` no estan instalados ni conectados), asi que desde este entorno no se pudo ejecutar una publicacion verificada en un host externo sin inventar pasos.

Lo que si quedo resuelto:

- salida estatica final
- workflow de GitHub Pages listo
- estructura apta para una URL profesional
- sin previews efimeras ni tuneles

## Paso minimo para dejarla online con URL limpia

1. Crear o usar un repositorio llamado `valorhumano-uy`.
2. Subir esta carpeta como contenido del repo.
3. Usar la rama `main`.
4. Dejar que GitHub Actions ejecute el workflow de Pages.
5. La URL temporal limpia quedara en `https://TU-USUARIO.github.io/valorhumano-uy/`.

## Dominio propio

Cuando se quiera pasar a dominio final:

1. Configurar `www.valorhumano.com.uy` como custom domain en GitHub Pages.
2. Apuntar DNS del dominio al host configurado por GitHub Pages.
3. Activar HTTPS desde Pages cuando quede disponible.

## Nota final

No conviene volver a publicar este proyecto en previews numericas, tuneles o slugs efimeros. La salida correcta para esta version es una publicacion estatica estable con nombre limpio.
