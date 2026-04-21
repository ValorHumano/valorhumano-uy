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

## URL publicada

La salida estatica de esta version queda publicada en GitHub Pages en:

- `https://jhonatan202020.github.io/valorhumano-uy/`

Cuando exista dominio propio:

- `https://www.valorhumano.com.uy`
- `https://valorhumano.com.uy`

## Estado tecnico de publicacion

La carpeta ya se inicializo como repositorio git, se empujo a `jhonatan202020/valorhumano-uy` y GitHub Pages quedo configurado para publicar via workflow.

La URL `https://valorhumano.github.io/valorhumano-uy/` no se pudo usar porque ese usuario no existe hoy en GitHub. La variante limpia real disponible desde este entorno es la publicada arriba.

## Dominio propio

Cuando se quiera pasar a dominio final:

1. Configurar `www.valorhumano.com.uy` como custom domain en GitHub Pages.
2. Apuntar DNS del dominio al host configurado por GitHub Pages.
3. Activar HTTPS desde Pages cuando quede disponible.

## Nota final

No conviene volver a publicar este proyecto en previews numericas, tuneles o slugs efimeros. La salida correcta para esta version es una publicacion estatica estable con nombre limpio.
