$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Get-NavLink([string]$activeKey, [string]$key, [string]$href, [string]$label) {
  $active = if ($activeKey -eq $key) { ' class="active"' } else { '' }
  return "          <li><a$active href=""$href"">$label</a></li>"
}

function Get-Header([string]$activeKey) {
  return @"
  <header class="site-header">
    <div class="container header-shell">
      <a class="brand-link" href="./" aria-label="Valor Humano, volver al inicio">
        <img class="brand-logo" src="assets/brand/logo-valor-humano.svg" alt="Valor Humano" />
      </a>

      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-panel" aria-label="Abrir men&uacute;">
        <span></span><span></span><span></span>
        <span class="nav-toggle-label">Abrir men&uacute;</span>
      </button>

      <nav class="nav-panel" id="nav-panel" aria-label="Principal">
        <ul class="nav-menu">
$(Get-NavLink $activeKey 'home' './' 'Inicio')
$(Get-NavLink $activeKey 'about' 'nosotros/' 'Nosotros')
$(Get-NavLink $activeKey 'selection' 'seleccion-de-personal/' 'Selecci&oacute;n de personal')
$(Get-NavLink $activeKey 'outsourcing' 'tercerizacion-de-personal/' 'Tercerizaci&oacute;n de personal')
$(Get-NavLink $activeKey 'payroll' 'payroll/' 'Payroll')
$(Get-NavLink $activeKey 'logistics' 'asesoramiento-logistico/' 'Asesoramiento log&iacute;stico')
$(Get-NavLink $activeKey 'enterprises' 'empresas/' 'Empresas')
$(Get-NavLink $activeKey 'jobs' 'empleos/' 'Empleos')
$(Get-NavLink $activeKey 'contact' 'contacto/' 'Contacto')
        </ul>
      </nav>
    </div>
  </header>
"@
}

function Get-Footer() {
  return @"
  <footer class="site-footer">
    <div class="container">
      <div class="footer-shell">
        <div class="footer-top">
          <div class="footer-brand-block">
            <div class="footer-brand-panel">
              <img class="footer-brand" src="assets/brand/logo-valor-humano.svg" alt="Valor Humano" />
            </div>
            <p class="footer-copy">Valor Humano acompa&ntilde;a empresas con selecci&oacute;n, tercerizaci&oacute;n, payroll y asesoramiento log&iacute;stico desde una conversaci&oacute;n clara, una lectura pr&aacute;ctica del trabajo real y una respuesta profesional sostenida.</p>
            <div class="footer-chip-row">
              <span class="chip">Colonia del Sacramento</span>
              <span class="chip">Cobertura para empresas</span>
            </div>
          </div>

          <div class="footer-grid">
            <div>
              <h4>Servicios</h4>
              <div class="footer-links">
                <a href="seleccion-de-personal/">Selecci&oacute;n de personal</a>
                <a href="tercerizacion-de-personal/">Tercerizaci&oacute;n de personal</a>
                <a href="payroll/">Payroll</a>
                <a href="asesoramiento-logistico/">Asesoramiento log&iacute;stico</a>
              </div>
            </div>

            <div>
              <h4>Empresa</h4>
              <div class="footer-links">
                <a href="nosotros/">Nosotros</a>
                <a href="empresas/">Empresas</a>
                <a href="empleos/">Empleos</a>
                <a href="contacto/">Contacto</a>
              </div>
            </div>

            <div>
              <h4>Canales</h4>
              <div class="footer-links">
                <a href="mailto:contacto@valorhumano.com.uy">contacto@valorhumano.com.uy</a>
                <a href="mailto:seleccion@valorhumano.com.uy">seleccion@valorhumano.com.uy</a>
                <a href="#" data-wa-link data-wa-message="Hola Valor Humano, quiero hacer una consulta." rel="noreferrer">WhatsApp Valor Humano</a>
                <a href="https://www.instagram.com/humano_valor?igsh=dDNteng3dHF6cWFy" target="_blank" rel="noreferrer">Instagram</a>
                <a href="https://www.facebook.com/profile.php?id=61572000190463&sk=directory_intro" target="_blank" rel="noreferrer">Facebook</a>
                <span>Colonia del Sacramento</span>
                <span>Lunes a viernes | 8:00 a 18:00</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-base">
          <span>Consultora orientada a resolver personal, n&oacute;mina y operaci&oacute;n con criterio ejecutivo.</span>
          <span>Salida est&aacute;tica lista para publicaci&oacute;n estable.</span>
        </div>
      </div>
    </div>
  </footer>
"@
}

function Get-OrganizationSchema() {
  return @'
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Valor Humano",
    "description": "Consultora orientada a seleccion de personal, tercerizacion de personal, payroll y asesoramiento logistico.",
    "email": "contacto@valorhumano.com.uy",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Colonia del Sacramento",
      "addressCountry": "UY"
    },
    "areaServed": "Uruguay",
    "sameAs": [
      "https://www.instagram.com/humano_valor?igsh=dDNteng3dHF6cWFy",
      "https://www.facebook.com/profile.php?id=61572000190463&sk=directory_intro"
    ]
  }
  </script>
'@
}

function Get-Page(
  [string]$title,
  [string]$description,
  [string]$pageClass,
  [string]$activeKey,
  [string]$baseTag,
  [string]$bodyContent,
  [string]$robots = 'index, follow'
) {
  $schemaMarkup = if ($pageClass -eq 'page-404') { '' } else { Get-OrganizationSchema }

  return @"
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="$description" />
  <meta name="robots" content="$robots" />
  <meta name="theme-color" content="#eef1f4" />
  <meta name="format-detection" content="telephone=no" />
  <meta property="og:locale" content="es_UY" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Valor Humano" />
  <meta property="og:title" content="$title" />
  <meta property="og:description" content="$description" />
  <title>$title</title>
$baseTag  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="icon" type="image/svg+xml" href="assets/brand/favicon.svg" />
  <link rel="apple-touch-icon" href="assets/brand/logo-valor-humano.png" />
  <link rel="stylesheet" href="css/style.css?v=20260421a" />
$schemaMarkup
</head>
<body class="$pageClass">
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
$(Get-Header $activeKey)

  <main id="contenido">
$bodyContent
  </main>
$(Get-Footer)

  <script src="js/site.js?v=20260421a"></script>
</body>
</html>
"@
}

function Get-RedirectPage([string]$title, [string]$target) {
  return @"
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="refresh" content="0; url=$target" />
  <link rel="canonical" href="$target" />
  <title>$title</title>
  <script>window.location.replace("$target");</script>
</head>
<body>
  <p>Redirigiendo a <a href="$target">$target</a>...</p>
</body>
</html>
"@
}

$indexBody = @'
    <section class="hero">
      <div class="container">
        <div class="hero-shell">
          <div class="hero-main">
            <div class="hero-badge-row">
              <p class="eyebrow">Consultora para empresas</p>
              <span class="hero-chip">Colonia del Sacramento</span>
            </div>
            <h1 class="hero-title">Selecci&oacute;n, cobertura, payroll y operaci&oacute;n con una lectura clara del trabajo real.</h1>
            <p class="hero-lead">Valor Humano acompa&ntilde;a empresas que necesitan incorporar mejor, sostener cobertura, descargar payroll o revisar una operaci&oacute;n con criterio pr&aacute;ctico, comercial y profesional.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="empresas/">Registrar empresa</a>
              <a class="btn btn-secondary" href="contacto/">Solicitar asesoramiento</a>
            </div>

            <div class="hero-grid">
              <article class="hero-metric">
                <strong>Selecci&oacute;n</strong>
                <span>Procesos mejor relevados para decidir con m&aacute;s base y menos error.</span>
              </article>
              <article class="hero-metric">
                <strong>Tercerizaci&oacute;n</strong>
                <span>Cobertura, reemplazos y continuidad para equipos que no pueden frenar.</span>
              </article>
              <article class="hero-metric">
                <strong>Payroll</strong>
                <span>Altas, bajas, liquidaciones y documentaci&oacute;n con m&aacute;s prolijidad.</span>
              </article>
              <article class="hero-metric">
                <strong>Operaci&oacute;n</strong>
                <span>Layout, stock, picking y trazabilidad con mirada aplicada.</span>
              </article>
            </div>
          </div>

          <div class="hero-side">
            <figure class="hero-media">
              <img src="assets/media/home-hero.jpg" alt="Reuni&oacute;n profesional para ordenar una necesidad empresarial" />
            </figure>

            <article class="hero-note">
              <p class="card-kicker">Sectores donde suma</p>
              <h3>Industria, retail, hoteler&iacute;a, dep&oacute;sitos y servicios donde personas, continuidad y operaci&oacute;n impactan todos los d&iacute;as.</h3>
              <div class="tag-row">
                <span class="chip">Industria</span>
                <span class="chip">Retail</span>
                <span class="chip">Hoteler&iacute;a</span>
                <span class="chip">Dep&oacute;sitos</span>
                <span class="chip">Servicios</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="servicios">
      <div class="container">
        <div class="section-header">
          <p class="eyebrow">Servicios</p>
          <h2 class="section-title wide">Cuatro frentes separados para resolver cada necesidad con m&aacute;s claridad.</h2>
          <p class="section-intro">Inicio presenta la panor&aacute;mica. Cada servicio desarrolla su problema, alcance y forma de trabajo en una p&aacute;gina propia.</p>
        </div>

        <div class="service-grid">
          <article class="service-card">
            <div class="service-media">
              <img src="assets/media/selection-detail.jpg" alt="Entrevista profesional en un proceso de selecci&oacute;n" />
            </div>
            <div class="service-content">
              <p class="card-kicker">Selecci&oacute;n</p>
              <h3>Selecci&oacute;n de personal</h3>
              <p>Relevamiento del perfil, filtro curricular, entrevistas, referencias y shortlist para decidir con m&aacute;s respaldo.</p>
              <a class="service-link" href="seleccion-de-personal/">Ver servicio</a>
            </div>
          </article>

          <article class="service-card">
            <div class="service-media">
              <img src="assets/media/outsourcing-card.jpg" alt="Equipo operativo en marcha para sostener cobertura y continuidad" />
            </div>
            <div class="service-content">
              <p class="card-kicker">Continuidad</p>
              <h3>Tercerizaci&oacute;n de personal</h3>
              <p>Cobertura, reemplazos y dotaciones para sostener operaci&oacute;n diaria con seguimiento m&aacute;s prolijo.</p>
              <a class="service-link" href="tercerizacion-de-personal/">Ver servicio</a>
            </div>
          </article>

          <article class="service-card">
            <div class="service-media">
              <img src="assets/media/about-hero.jpg" alt="Soporte administrativo y documental en un entorno profesional" />
            </div>
            <div class="service-content">
              <p class="card-kicker">Administraci&oacute;n</p>
              <h3>Payroll</h3>
              <p>Altas, bajas, liquidaciones y documentaci&oacute;n para descargar gesti&oacute;n sensible del equipo interno.</p>
              <a class="service-link" href="payroll/">Ver servicio</a>
            </div>
          </article>

          <article class="service-card">
            <div class="service-media">
              <img src="assets/media/home-logistics.jpg" alt="Operaci&oacute;n log&iacute;stica con stock, racks y preparaci&oacute;n" />
            </div>
            <div class="service-content">
              <p class="card-kicker">Orden operativo</p>
              <h3>Asesoramiento log&iacute;stico</h3>
              <p>Layout, stock, picking, abastecimiento y trazabilidad para recuperar orden y visibilidad.</p>
              <a class="service-link" href="asesoramiento-logistico/">Ver servicio</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="section-header">
            <p class="eyebrow">Diferenciales</p>
            <h2 class="section-title wide">Una relaci&oacute;n comercial sobria, una lectura pr&aacute;ctica del caso y seguimiento donde hace falta.</h2>
          </div>

          <div class="card-grid-3">
            <article class="metal-card">
              <p class="card-kicker">Criterio</p>
              <h3>Primero se entiende bien el problema. Despu&eacute;s se define el frente correcto.</h3>
              <p>Esa secuencia evita mezclar selecci&oacute;n, cobertura, n&oacute;mina y operaci&oacute;n como si fueran lo mismo.</p>
            </article>

            <article class="metal-card">
              <p class="card-kicker">Respuesta</p>
              <h3>La empresa recibe un intercambio claro, ordenado y con buena jerarqu&iacute;a de informaci&oacute;n.</h3>
              <p>No se vende ruido. Se busca dejar mejor planteado qu&eacute; conviene hacer y por d&oacute;nde empezar.</p>
            </article>

            <article class="metal-card">
              <p class="card-kicker">Lectura pr&aacute;ctica</p>
              <h3>El foco est&aacute; puesto en c&oacute;mo trabaja de verdad la empresa y d&oacute;nde est&aacute; el impacto.</h3>
              <p>Eso vale tanto para una incorporaci&oacute;n como para una cobertura, una n&oacute;mina o una operaci&oacute;n con movimiento real.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <p class="eyebrow">Rubros</p>
          <h2 class="section-title wide">Sectores donde el orden de personas y operaci&oacute;n impacta directo en el d&iacute;a a d&iacute;a.</h2>
        </div>

        <div class="sector-grid">
          <article class="sector-card">
            <strong>Industria y plantas</strong>
            <span>Incorporaci&oacute;n, cobertura y orden operativo donde el ritmo no admite improvisaci&oacute;n.</span>
          </article>
          <article class="sector-card">
            <strong>Retail y cadenas</strong>
            <span>Reposici&oacute;n, picos de actividad, dotaciones y continuidad comercial en piso.</span>
          </article>
          <article class="sector-card">
            <strong>Hoteler&iacute;a y servicio</strong>
            <span>Cobertura, flexibilidad y coordinaci&oacute;n para equipos que no pueden quedar cortos.</span>
          </article>
          <article class="sector-card">
            <strong>Mayoristas y dep&oacute;sitos</strong>
            <span>Stock, picking, trazabilidad y circuitos con movimiento real de mercader&iacute;a.</span>
          </article>
        </div>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="portal-grid">
          <article class="portal-card">
            <div class="portal-content">
              <p class="card-kicker">Empresas</p>
              <h3>La entrada comercial para ordenar la necesidad y derivarla al servicio correcto.</h3>
              <p>Sirve para dejar claro qu&eacute; est&aacute; pasando hoy, qu&eacute; urgencia existe y cu&aacute;l es el siguiente paso que conviene activar.</p>
              <div class="hero-actions">
                <a class="btn btn-primary" href="empresas/">Registrar empresa</a>
              </div>
            </div>
          </article>

          <article class="portal-card">
            <div class="portal-content">
              <p class="card-kicker">Empleos</p>
              <h3>Un recorrido separado para postular con referencia, localidad y CV adjunto.</h3>
              <p>Queda fuera del circuito comercial para que la postulaci&oacute;n sea m&aacute;s simple, m&aacute;s clara y mejor ordenada.</p>
              <div class="hero-actions">
                <a class="btn btn-secondary" href="empleos/">Postularme</a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta-band">
          <div>
            <p class="eyebrow">Siguiente paso</p>
            <h2>Si la necesidad ya est&aacute; planteada, conviene dejarla clara y avanzar por el frente correcto.</h2>
            <p>Empresas concentra el inicio comercial. Contacto re&uacute;ne los canales institucionales visibles para continuar la conversaci&oacute;n.</p>
          </div>
          <div class="hero-actions">
            <a class="btn btn-primary" href="empresas/">Ir a Empresas</a>
            <a class="btn btn-secondary" href="contacto/">Ver contacto</a>
          </div>
        </div>
      </div>
    </section>
'@

$aboutBody = @'
    <section class="hero">
      <div class="container">
        <div class="hero-shell">
          <div class="hero-main">
            <div class="hero-badge-row">
              <p class="eyebrow">Nosotros</p>
              <span class="hero-chip">Colonia del Sacramento</span>
            </div>
            <h1 class="hero-title">Cercan&iacute;a profesional, criterio y una forma de acompa&ntilde;ar que se apoya en el trabajo real.</h1>
            <p class="hero-lead">Valor Humano trabaja para empresas que necesitan una consultora clara, sobria y bien enfocada para resolver personal, n&oacute;mina y operaci&oacute;n sin discursos vac&iacute;os.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="empresas/">Ir a Empresas</a>
              <a class="btn btn-secondary" href="contacto/">Contactar</a>
            </div>
          </div>

          <div class="hero-side">
            <figure class="hero-media">
              <img src="assets/media/companies-executive.jpg" alt="Reuni&oacute;n ejecutiva para ordenar una necesidad empresarial" />
            </figure>
            <article class="hero-note">
              <p class="card-kicker">Qui&eacute;nes somos</p>
              <h3>Una consultora local con mirada empresarial, trato cercano y una forma de trabajo m&aacute;s firme que improvisada.</h3>
              <div class="tag-row">
                <span class="chip">Criterio</span>
                <span class="chip">Seguimiento</span>
                <span class="chip">Claridad</span>
                <span class="chip">Respaldo</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="card-grid-2">
          <article class="split-panel">
            <p class="card-kicker">Misi&oacute;n</p>
            <h3>Acompa&ntilde;ar decisiones de personal y operaci&oacute;n con una respuesta clara, bien enfocada y &uacute;til para la empresa.</h3>
            <p>La misi&oacute;n no es sumar capas de discurso. Es ayudar a que la empresa incorpore mejor, sostenga cobertura, ordene payroll o revise una operaci&oacute;n con un criterio m&aacute;s pr&aacute;ctico.</p>
          </article>

          <article class="split-panel">
            <p class="card-kicker">Visi&oacute;n</p>
            <h3>Ser una consultora reconocida por su seriedad comercial, su cercan&iacute;a profesional y su lectura concreta del trabajo real.</h3>
            <p>La visi&oacute;n apunta a construir relaciones sostenidas, donde la empresa encuentre una interlocuci&oacute;n confiable y no una respuesta gen&eacute;rica.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="section-header">
            <p class="eyebrow">Valores</p>
            <h2 class="section-title wide">Una forma de trabajar basada en criterio, cercan&iacute;a y lectura pr&aacute;ctica.</h2>
          </div>

          <div class="card-grid-3">
            <article class="metal-card">
              <p class="card-kicker">Claridad</p>
              <h3>Cada necesidad se encuadra bien antes de activar un servicio o prometer una salida r&aacute;pida.</h3>
              <p>Eso ordena la conversaci&oacute;n y mejora la calidad del siguiente paso.</p>
            </article>

            <article class="metal-card">
              <p class="card-kicker">Cercan&iacute;a profesional</p>
              <h3>El trato es humano y cercano, pero siempre sostenido por seriedad comercial y buen criterio.</h3>
              <p>La cercan&iacute;a suma cuando la empresa siente respaldo, no cuando todo queda demasiado informal.</p>
            </article>

            <article class="metal-card">
              <p class="card-kicker">Lectura pr&aacute;ctica</p>
              <h3>La mirada apunta a c&oacute;mo funciona de verdad el puesto, el equipo, la n&oacute;mina o la operaci&oacute;n.</h3>
              <p>Ah&iacute; est&aacute; el valor de una consultora que busca ser &uacute;til y no decorativa.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <p class="eyebrow">M&eacute;todo</p>
          <h2 class="section-title wide">Una secuencia simple para entender bien el caso y acompa&ntilde;arlo con m&aacute;s orden.</h2>
        </div>

        <div class="process-grid">
          <article class="process-card">
            <span class="step-index">01</span>
            <h3>Escucha inicial</h3>
            <p>Se releva la necesidad, la urgencia y el contexto donde aparece el problema.</p>
          </article>
          <article class="process-card">
            <span class="step-index">02</span>
            <h3>Lectura del frente</h3>
            <p>Se define si conviene selecci&oacute;n, tercerizaci&oacute;n, payroll o revisi&oacute;n operativa.</p>
          </article>
          <article class="process-card">
            <span class="step-index">03</span>
            <h3>Propuesta clara</h3>
            <p>La empresa recibe un planteo m&aacute;s ordenado, con alcance y siguiente paso visibles.</p>
          </article>
          <article class="process-card">
            <span class="step-index">04</span>
            <h3>Seguimiento</h3>
            <p>El acompa&ntilde;amiento se sostiene con criterio, respuesta y buena comunicaci&oacute;n.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="card-grid-2">
            <article class="metal-card">
              <p class="card-kicker">Ubicaci&oacute;n</p>
              <h3>Trabajar desde Colonia del Sacramento aporta cercan&iacute;a, contexto regional y una relaci&oacute;n menos distante con la necesidad real de cada empresa.</h3>
              <p>La ubicaci&oacute;n suma lectura situada, disponibilidad y una forma de acompa&ntilde;ar m&aacute;s concreta para Colonia y zonas cercanas.</p>
            </article>

            <article class="quote-panel">
              <p class="card-kicker">Forma de acompa&ntilde;ar</p>
              <blockquote>La confianza se construye entendiendo bien el problema, proponiendo con claridad y sosteniendo la respuesta con prolijidad.</blockquote>
              <cite>Valor Humano | Nosotros</cite>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta-band">
          <div>
            <p class="eyebrow">Empresas</p>
            <h2>Si quer&eacute;s plantear una necesidad concreta, Empresas permite empezar con m&aacute;s orden desde el primer intercambio.</h2>
            <p>Ah&iacute; se releva el caso y se define mejor por qu&eacute; frente conviene avanzar.</p>
          </div>
          <div class="hero-actions">
            <a class="btn btn-primary" href="empresas/">Ir a Empresas</a>
            <a class="btn btn-secondary" href="contacto/">Ver contacto</a>
          </div>
        </div>
      </div>
    </section>
'@

$selectionBody = @'
    <section class="hero">
      <div class="container">
        <div class="hero-shell">
          <div class="hero-main">
            <div class="hero-badge-row">
              <p class="eyebrow">Selecci&oacute;n de personal</p>
              <span class="hero-chip">Decisi&oacute;n mejor respaldada</span>
            </div>
            <h1 class="hero-title">Un proceso de selecci&oacute;n mejor ordenado para incorporar con m&aacute;s criterio.</h1>
            <p class="hero-lead">La selecci&oacute;n no se resuelve solo difundiendo un aviso. Requiere entender el puesto, el contexto, el nivel de exigencia y acompa&ntilde;ar la decisi&oacute;n con mejor informaci&oacute;n.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="empresas/">Registrar b&uacute;squeda</a>
              <a class="btn btn-secondary" href="contacto/">Solicitar asesoramiento</a>
            </div>
          </div>

          <div class="hero-side">
            <figure class="hero-media">
              <img src="assets/media/selection-hero.jpg" alt="Entrevista profesional dentro de un proceso de selecci&oacute;n" />
            </figure>
            <article class="hero-note">
              <p class="card-kicker">Qu&eacute; se trabaja</p>
              <h3>Perfil, contexto del puesto, entrevistas, referencias y evaluaciones complementarias cuando el caso lo requiere.</h3>
              <div class="tag-row">
                <span class="chip">Perfil</span>
                <span class="chip">Filtro</span>
                <span class="chip">Entrevistas</span>
                <span class="chip">Shortlist</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split-layout">
        <article class="split-panel">
          <p class="card-kicker">Qu&eacute; problema resuelve</p>
          <h3>Ayuda a reducir error cuando la incorporaci&oacute;n necesita una lectura m&aacute;s fina del puesto y de la persona.</h3>
          <p>Conviene cuando la vacante tiene peso sobre el equipo, el cliente, la operaci&oacute;n o la calidad de la decisi&oacute;n final.</p>
        </article>

        <article class="list-panel">
          <p class="card-kicker">Cu&aacute;ndo conviene</p>
          <ul class="bullet-list">
            <li>Cuando hace falta comprender bien el puesto y el entorno donde se va a trabajar.</li>
            <li>Cuando la empresa necesita filtrar mejor el volumen de perfiles.</li>
            <li>Cuando la decisi&oacute;n merece m&aacute;s respaldo que una revisi&oacute;n superficial.</li>
            <li>Cuando una mala incorporaci&oacute;n genera costo, demora y desgaste interno.</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="section-header">
            <p class="eyebrow">C&oacute;mo se trabaja</p>
            <h2 class="section-title wide">Una secuencia clara para relevar mejor el perfil y acompa&ntilde;ar la decisi&oacute;n final.</h2>
          </div>

          <div class="process-grid">
            <article class="process-card">
              <span class="step-index">01</span>
              <h3>Relevamiento del perfil</h3>
              <p>Se entiende el puesto, el contexto, el equipo y el ajuste que la empresa necesita.</p>
            </article>
            <article class="process-card">
              <span class="step-index">02</span>
              <h3>Filtro curricular</h3>
              <p>Se ordenan postulaciones y se descartan perfiles que no ajustan al caso.</p>
            </article>
            <article class="process-card">
              <span class="step-index">03</span>
              <h3>Entrevistas</h3>
              <p>Se revisa experiencia, criterio, motivaci&oacute;n y capacidad real para desempe&ntilde;ar el rol.</p>
            </article>
            <article class="process-card">
              <span class="step-index">04</span>
              <h3>Referencias y evaluaciones</h3>
              <p>Si corresponde, se suman referencias y pruebas complementarias o psicot&eacute;cnicas.</p>
            </article>
            <article class="process-card">
              <span class="step-index">05</span>
              <h3>Shortlist y acompa&ntilde;amiento</h3>
              <p>La empresa recibe mejores elementos para comparar, priorizar y decidir.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="card-grid-2">
          <article class="metal-card">
            <p class="card-kicker">Qu&eacute; incluye</p>
            <ul class="summary-list">
              <li>Comprensi&oacute;n del puesto y del contexto donde se va a trabajar.</li>
              <li>Difusi&oacute;n de la b&uacute;squeda y recepci&oacute;n ordenada de postulaciones.</li>
              <li>Filtro curricular, entrevistas y an&aacute;lisis del ajuste al rol.</li>
              <li>Referencias y evaluaciones complementarias si el caso lo requiere.</li>
              <li>Shortlist final y acompa&ntilde;amiento para decidir mejor.</li>
            </ul>
          </article>

          <article class="metal-card">
            <p class="card-kicker">Perfiles que se cubren</p>
            <h3>Administrativos, comerciales, operativos, mandos medios y posiciones donde el ajuste pesa de verdad.</h3>
            <p>La selecci&oacute;n suma especialmente cuando la empresa necesita respaldo para elegir mejor y no solo velocidad para cerrar una vacante.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="metric-strip">
            <article class="metal-card">
              <p class="card-kicker">Mejor ajuste</p>
              <h3>La incorporaci&oacute;n gana m&aacute;s contexto y mejor lectura del rol.</h3>
            </article>
            <article class="metal-card">
              <p class="card-kicker">Menos error</p>
              <h3>Se baja el riesgo de decidir con poca informaci&oacute;n o demasiado apuro.</h3>
            </article>
            <article class="metal-card">
              <p class="card-kicker">Decisi&oacute;n m&aacute;s clara</p>
              <h3>La empresa compara mejor y elige con una base m&aacute;s prolija.</h3>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta-band">
          <div>
            <p class="eyebrow">Empresas</p>
            <h2>Si la vacante ya est&aacute; planteada, conviene empezar por el perfil, el contexto y la urgencia de la incorporaci&oacute;n.</h2>
            <p>Desde Empresas pod&eacute;s dejar la b&uacute;squeda mejor planteada para ordenar el primer paso.</p>
          </div>
          <div class="hero-actions">
            <a class="btn btn-primary" href="empresas/">Registrar empresa</a>
            <a class="btn btn-secondary" href="contacto/">Contactar</a>
          </div>
        </div>
      </div>
    </section>
'@

$outsourcingBody = @'
    <section class="hero">
      <div class="container">
        <div class="hero-shell">
          <div class="hero-main">
            <div class="hero-badge-row">
              <p class="eyebrow">Tercerizaci&oacute;n de personal</p>
              <span class="hero-chip">Continuidad operativa</span>
            </div>
            <h1 class="hero-title">Cobertura y continuidad para operaciones que necesitan seguir en marcha.</h1>
            <p class="hero-lead">La tercerizaci&oacute;n permite resolver reemplazos, dotaciones, picos de demanda, zafras y necesidades de continuidad sin cargar al equipo interno con m&aacute;s coordinaci&oacute;n de la necesaria.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="empresas/">Solicitar cobertura</a>
              <a class="btn btn-secondary" href="contacto/">Solicitar asesoramiento</a>
            </div>
          </div>

          <div class="hero-side">
            <figure class="hero-media">
              <img src="assets/media/outsourcing-card.jpg" alt="Equipo operativo trabajando para sostener cobertura y continuidad" />
            </figure>
            <article class="hero-note">
              <p class="card-kicker">D&oacute;nde suma</p>
              <h3>Operaciones con turnos, picos de actividad, reemplazos frecuentes o tareas donde quedar corto impacta enseguida.</h3>
              <div class="tag-row">
                <span class="chip">Cobertura</span>
                <span class="chip">Reemplazos</span>
                <span class="chip">Picos</span>
                <span class="chip">Seguimiento</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split-layout">
        <article class="split-panel">
          <p class="card-kicker">Qu&eacute; resuelve</p>
          <h3>Da una salida m&aacute;s ordenada cuando la prioridad es sostener la operaci&oacute;n diaria con flexibilidad y continuidad.</h3>
          <p>Es un servicio pensado para empresas donde la cobertura diaria, los horarios, los reemplazos y el volumen de trabajo tienen impacto directo sobre el resultado.</p>
        </article>

        <article class="list-panel">
          <p class="card-kicker">Cu&aacute;ndo conviene</p>
          <ul class="bullet-list">
            <li>Cuando hay picos de actividad, zafras o aumentos de demanda.</li>
            <li>Cuando los reemplazos son frecuentes y la operaci&oacute;n no admite vac&iacute;os.</li>
            <li>Cuando la empresa necesita flexibilidad sin desordenar su estructura interna.</li>
            <li>Cuando la coordinaci&oacute;n diaria ya est&aacute; consumiendo demasiado tiempo del equipo propio.</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="section-header">
            <p class="eyebrow">C&oacute;mo se ordena</p>
            <h2 class="section-title wide">Una respuesta pensada para cubrir, coordinar y sostener continuidad sin sumar ruido.</h2>
          </div>

          <div class="process-grid">
            <article class="process-card">
              <span class="step-index">01</span>
              <h3>Lectura de la operaci&oacute;n</h3>
              <p>Se entienden horarios, volumen, criticidad de la tarea y ritmo real de trabajo.</p>
            </article>
            <article class="process-card">
              <span class="step-index">02</span>
              <h3>Definici&oacute;n de cobertura</h3>
              <p>Se ordena si la necesidad pasa por reemplazo, dotaci&oacute;n, pico puntual o continuidad sostenida.</p>
            </article>
            <article class="process-card">
              <span class="step-index">03</span>
              <h3>Coordinaci&oacute;n</h3>
              <p>La respuesta se organiza con una interlocuci&oacute;n m&aacute;s clara entre necesidad y cobertura.</p>
            </article>
            <article class="process-card">
              <span class="step-index">04</span>
              <h3>Seguimiento</h3>
              <p>La empresa gana continuidad, menos carga interna y mejor orden en el d&iacute;a a d&iacute;a.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="card-grid-2">
          <article class="metal-card">
            <p class="card-kicker">Qu&eacute; incluye</p>
            <ul class="summary-list">
              <li>Definici&oacute;n del frente a cubrir, volumen y criticidad del servicio.</li>
              <li>Coordinaci&oacute;n de reemplazos, picos de demanda y necesidades eventuales o sostenidas.</li>
              <li>Seguimiento operativo para sostener orden y continuidad.</li>
              <li>Menor carga interna en tareas de cobertura cotidiana.</li>
            </ul>
          </article>

          <article class="metal-card">
            <p class="card-kicker">D&oacute;nde aplica</p>
            <h3>Retail, hoteler&iacute;a, dep&oacute;sitos, industria, log&iacute;stica y servicios donde el ritmo diario no admite quedar descubierto.</h3>
            <p>Este servicio no reemplaza una selecci&oacute;n profunda. Resuelve continuidad, respuesta y coordinaci&oacute;n operativa.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="metric-strip">
            <article class="metal-card">
              <p class="card-kicker">Continuidad</p>
              <h3>Menos riesgo de interrupciones en tareas que impactan sobre servicio y productividad.</h3>
            </article>
            <article class="metal-card">
              <p class="card-kicker">Flexibilidad</p>
              <h3>M&aacute;s capacidad para responder a movimientos de volumen sin desordenar la estructura interna.</h3>
            </article>
            <article class="metal-card">
              <p class="card-kicker">Menos carga interna</p>
              <h3>Una coordinaci&oacute;n m&aacute;s prolija entre necesidad, cobertura y seguimiento diario.</h3>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta-band">
          <div>
            <p class="eyebrow">Empresas</p>
            <h2>Si la prioridad est&aacute; en cubrir turnos, reemplazos o picos de actividad, conviene relevar volumen, horarios y criticidad desde el inicio.</h2>
            <p>Desde Empresas pod&eacute;s dejar esa base y avanzar con una respuesta m&aacute;s ordenada.</p>
          </div>
          <div class="hero-actions">
            <a class="btn btn-primary" href="empresas/">Registrar empresa</a>
            <a class="btn btn-secondary" href="contacto/">Contactar</a>
          </div>
        </div>
      </div>
    </section>
'@

$payrollBody = @'
    <section class="hero">
      <div class="container">
        <div class="hero-shell">
          <div class="hero-main">
            <div class="hero-badge-row">
              <p class="eyebrow">Payroll</p>
              <span class="hero-chip">Orden administrativo</span>
            </div>
            <h1 class="hero-title">Administraci&oacute;n laboral operativa con m&aacute;s prolijidad, control y continuidad.</h1>
            <p class="hero-lead">Payroll descarga a la empresa de la gesti&oacute;n administrativa vinculada al personal: altas, bajas, liquidaciones, documentaci&oacute;n y seguimiento de una n&oacute;mina que no puede quedar desordenada.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="empresas/">Solicitar asesoramiento</a>
              <a class="btn btn-secondary" href="contacto/">Solicitar contacto</a>
            </div>
          </div>

          <div class="hero-side">
            <figure class="hero-media">
              <img src="assets/media/about-hero.jpg" alt="Soporte administrativo y revisi&oacute;n documental en un entorno profesional" />
            </figure>
            <article class="hero-note">
              <p class="card-kicker">Qu&eacute; descarga</p>
              <h3>Altas, bajas, liquidaciones, control administrativo y seguimiento laboral con una l&oacute;gica m&aacute;s ordenada.</h3>
              <div class="tag-row">
                <span class="chip">Altas</span>
                <span class="chip">Bajas</span>
                <span class="chip">Liquidaciones</span>
                <span class="chip">Documentaci&oacute;n</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split-layout">
        <article class="split-panel">
          <p class="card-kicker">Qu&eacute; resuelve</p>
          <h3>Evita que la empresa absorba por dentro una carga administrativa que exige tiempo, prolijidad y control sostenido.</h3>
          <p>Cuando la n&oacute;mina crece, los movimientos son frecuentes o la documentaci&oacute;n ya ocupa demasiado lugar, conviene ordenar payroll con un frente dedicado.</p>
        </article>

        <article class="list-panel">
          <p class="card-kicker">Qu&eacute; libera</p>
          <ul class="bullet-list">
            <li>Tiempo interno consumido por tareas administrativas repetidas.</li>
            <li>Desorden en novedades, movimientos y documentaci&oacute;n sensible.</li>
            <li>Fricci&oacute;n operativa entre administraci&oacute;n, mandos y personal.</li>
            <li>Errores por falta de seguimiento o falta de control.</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="section-header">
            <p class="eyebrow">Alcance</p>
            <h2 class="section-title wide">Una administraci&oacute;n laboral orientada a sostener orden, control y continuidad alrededor del personal.</h2>
          </div>

          <div class="process-grid">
            <article class="process-card">
              <span class="step-index">01</span>
              <h3>Movimientos</h3>
              <p>Altas, bajas, cambios y novedades vinculadas a la n&oacute;mina.</p>
            </article>
            <article class="process-card">
              <span class="step-index">02</span>
              <h3>Liquidaciones</h3>
              <p>Relevamiento y orden de la informaci&oacute;n necesaria para una gesti&oacute;n de haberes prolija.</p>
            </article>
            <article class="process-card">
              <span class="step-index">03</span>
              <h3>Documentaci&oacute;n</h3>
              <p>Control administrativo y seguimiento laboral para evitar ruido y retrabajo.</p>
            </article>
            <article class="process-card">
              <span class="step-index">04</span>
              <h3>Continuidad</h3>
              <p>Una l&oacute;gica m&aacute;s estable para sostener procesos sensibles sin recargar al equipo interno.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="card-grid-2">
          <article class="metal-card">
            <p class="card-kicker">Qu&eacute; incluye</p>
            <ul class="summary-list">
              <li>Altas, bajas y movimientos asociados al personal.</li>
              <li>Relevamiento de novedades para liquidaciones y haberes.</li>
              <li>Documentaci&oacute;n administrativa y seguimiento laboral.</li>
              <li>Orden y control para sostener continuidad en procesos sensibles.</li>
              <li>Descarga operativa para que la empresa gane foco interno.</li>
            </ul>
          </article>

          <article class="quote-panel">
            <p class="card-kicker">Resultado</p>
            <blockquote>Un payroll bien resuelto no solo liquida. Tambi&eacute;n ordena, descarga y mejora la continuidad administrativa alrededor del personal.</blockquote>
            <cite>Valor Humano | Payroll</cite>
          </article>
        </div>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="metric-strip">
            <article class="metal-card">
              <p class="card-kicker">Prolijidad</p>
              <h3>Una n&oacute;mina mejor administrada evita ruido y mejora la visibilidad del proceso.</h3>
            </article>
            <article class="metal-card">
              <p class="card-kicker">Control</p>
              <h3>Documentaci&oacute;n y novedades con una l&oacute;gica m&aacute;s consistente.</h3>
            </article>
            <article class="metal-card">
              <p class="card-kicker">Tiempo interno</p>
              <h3>M&aacute;s disponibilidad del equipo para enfocarse en gesti&oacute;n y operaci&oacute;n, no en carga administrativa.</h3>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta-band">
          <div>
            <p class="eyebrow">Empresas</p>
            <h2>Si la n&oacute;mina ya est&aacute; consumiendo demasiado tiempo interno, conviene relevar movimientos, frecuencia y carga administrativa desde el inicio.</h2>
            <p>Desde Empresas pod&eacute;s dejar la consulta y seguir con un intercambio m&aacute;s claro.</p>
          </div>
          <div class="hero-actions">
            <a class="btn btn-primary" href="empresas/">Registrar empresa</a>
            <a class="btn btn-secondary" href="contacto/">Contactar</a>
          </div>
        </div>
      </div>
    </section>
'@

$logisticsBody = @'
    <section class="hero">
      <div class="container">
        <div class="hero-shell">
          <div class="hero-main">
            <div class="hero-badge-row">
              <p class="eyebrow">Asesoramiento log&iacute;stico</p>
              <span class="hero-chip">Orden operativo</span>
            </div>
            <h1 class="hero-title">Lectura operativa para ordenar stock, layout, picking y flujo de trabajo real.</h1>
            <p class="hero-lead">Es un servicio pr&aacute;ctico para dep&oacute;sitos, mayoristas, retail, hoteler&iacute;a y operaciones con movimiento donde hace falta ver mejor el circuito, detectar fricciones y priorizar mejoras aplicables.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="empresas/">Solicitar asesoramiento</a>
              <a class="btn btn-secondary" href="contacto/">Solicitar contacto</a>
            </div>
          </div>

          <div class="hero-side">
            <div class="showcase" data-showcase>
              <div class="showcase-viewport">
                <div class="showcase-slide is-active">
                  <figure class="showcase-media">
                    <img src="assets/media/logistics-hero.jpg" alt="Pasillo de dep&oacute;sito con racks y stock organizado" />
                  </figure>
                </div>
                <div class="showcase-slide" aria-hidden="true">
                  <figure class="showcase-media">
                    <img src="assets/media/home-logistics.jpg" alt="Vista general de una operaci&oacute;n log&iacute;stica con stock y preparaci&oacute;n" />
                  </figure>
                </div>
                <div class="showcase-slide" aria-hidden="true">
                  <div class="showcase-insight">
                    <p class="card-kicker">Frentes de mejora</p>
                    <h3>Layout, trazabilidad, abastecimiento, stock y picking con una mirada orientada a orden y flujo.</h3>
                    <ul class="summary-list">
                      <li>Menos demoras y recorridos innecesarios.</li>
                      <li>Mejor visibilidad del inventario y la preparaci&oacute;n.</li>
                      <li>Priorizaci&oacute;n clara de cambios aplicables.</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="showcase-controls">
                <button class="showcase-dot is-active" type="button" aria-pressed="true" aria-label="Ver imagen 1"></button>
                <button class="showcase-dot" type="button" aria-pressed="false" aria-label="Ver imagen 2"></button>
                <button class="showcase-dot" type="button" aria-pressed="false" aria-label="Ver imagen 3"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split-layout">
        <article class="split-panel">
          <p class="card-kicker">Qu&eacute; revisa</p>
          <h3>Observa el trabajo real para detectar d&oacute;nde se pierde tiempo, orden o visibilidad.</h3>
          <p>El punto de partida es concreto: c&oacute;mo entra el producto, c&oacute;mo se ubica, c&oacute;mo se prepara, c&oacute;mo se repone y d&oacute;nde aparecen fricciones evitables.</p>
        </article>

        <article class="list-panel">
          <p class="card-kicker">D&oacute;nde aplica</p>
          <ul class="bullet-list">
            <li>Dep&oacute;sitos con stock, racks y preparaci&oacute;n de pedidos.</li>
            <li>Mayoristas, supermercados y operaciones con abastecimiento interno.</li>
            <li>Hoteler&iacute;a y retail con movimiento constante de productos e insumos.</li>
            <li>Estructuras medianas que necesitan ganar orden y visibilidad operativa.</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="section-header">
            <p class="eyebrow">Frentes de revisi&oacute;n</p>
            <h2 class="section-title wide">Se trabaja sobre procesos concretos para detectar qu&eacute; conviene corregir primero.</h2>
          </div>

          <div class="process-grid">
            <article class="process-card">
              <span class="step-index">01</span>
              <h3>Layout y circulaci&oacute;n</h3>
              <p>Recorridos, uso del espacio y puntos donde la operaci&oacute;n se vuelve poco fluida.</p>
            </article>
            <article class="process-card">
              <span class="step-index">02</span>
              <h3>Stock e inventario</h3>
              <p>Disponibilidad, orden visual y consistencia de la informaci&oacute;n operativa.</p>
            </article>
            <article class="process-card">
              <span class="step-index">03</span>
              <h3>Picking y abastecimiento</h3>
              <p>Secuencia de tareas, tiempos, errores frecuentes y preparaci&oacute;n diaria.</p>
            </article>
            <article class="process-card">
              <span class="step-index">04</span>
              <h3>Trazabilidad y flujo</h3>
              <p>Visibilidad sobre el circuito para bajar fricciones y ganar control.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="card-grid-2">
          <article class="metal-card">
            <p class="card-kicker">Qu&eacute; aporta</p>
            <ul class="summary-list">
              <li>Ayuda a detectar demoras, desorden o baja visibilidad en procesos cotidianos.</li>
              <li>Ordena prioridades cuando la operaci&oacute;n tiene varios frentes abiertos al mismo tiempo.</li>
              <li>Permite revisar layout, abastecimiento, trazabilidad y preparaci&oacute;n con una mirada aplicada.</li>
              <li>Da base concreta para decidir qu&eacute; conviene corregir primero y por qu&eacute;.</li>
            </ul>
          </article>

          <article class="quote-panel">
            <p class="card-kicker">Resultado</p>
            <blockquote>Ordenar una operaci&oacute;n no es llenar de teor&iacute;a el problema. Es ver mejor el circuito, cortar fricciones y ganar control donde hoy falta claridad.</blockquote>
            <cite>Valor Humano | Asesoramiento log&iacute;stico</cite>
          </article>
        </div>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="metric-strip">
            <article class="metal-card">
              <p class="card-kicker">Claridad operativa</p>
              <h3>M&aacute;s lectura sobre stock, movimientos y puntos donde hoy se tranca el circuito.</h3>
            </article>
            <article class="metal-card">
              <p class="card-kicker">Mejora aplicada</p>
              <h3>Priorizaci&oacute;n concreta de cambios posibles, sin vender complejidad innecesaria.</h3>
            </article>
            <article class="metal-card">
              <p class="card-kicker">Decisiones pr&aacute;cticas</p>
              <h3>Mejor base para ordenar layout, abastecimiento, picking y trazabilidad.</h3>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="cta-band">
          <div>
            <p class="eyebrow">Empresas</p>
            <h2>Si el problema est&aacute; en stock, layout, picking o abastecimiento, conviene describir primero d&oacute;nde se frena hoy la operaci&oacute;n.</h2>
            <p>Desde Empresas pod&eacute;s dejar ese punto y avanzar con una revisi&oacute;n mucho m&aacute;s aplicada.</p>
          </div>
          <div class="hero-actions">
            <a class="btn btn-primary" href="empresas/">Registrar empresa</a>
            <a class="btn btn-secondary" href="contacto/">Contactar</a>
          </div>
        </div>
      </div>
    </section>
'@

$enterprisesBody = @'
    <section class="hero">
      <div class="container">
        <div class="hero-shell">
          <div class="hero-main">
            <div class="hero-badge-row">
              <p class="eyebrow">Empresas</p>
              <span class="hero-chip">Entrada comercial clara</span>
            </div>
            <h1 class="hero-title">Una entrada comercial para ordenar la necesidad y derivarla al servicio correcto.</h1>
            <p class="hero-lead">Esta p&aacute;gina est&aacute; pensada para relevar el caso, entender urgencia y contexto, y definir si conviene selecci&oacute;n, tercerizaci&oacute;n, payroll o asesoramiento log&iacute;stico.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#consulta-empresa">Registrar empresa</a>
              <a class="btn btn-secondary" href="contacto/">Ver contacto</a>
            </div>
          </div>

          <div class="hero-side">
            <figure class="hero-media">
              <img src="assets/media/companies-executive.jpg" alt="Reuni&oacute;n ejecutiva para relevar una necesidad empresarial" />
            </figure>
            <article class="hero-note">
              <p class="card-kicker">Qu&eacute; se ordena ac&aacute;</p>
              <h3>Incorporaciones, cobertura, n&oacute;mina y revisi&oacute;n operativa con una misma interlocuci&oacute;n comercial.</h3>
              <div class="tag-row">
                <span class="chip">Selecci&oacute;n</span>
                <span class="chip">Tercerizaci&oacute;n</span>
                <span class="chip">Payroll</span>
                <span class="chip">Operaci&oacute;n</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="section-header">
            <p class="eyebrow">C&oacute;mo inicia el v&iacute;nculo</p>
            <h2 class="section-title wide">Primero se releva bien la necesidad. Despu&eacute;s se define el servicio y el siguiente paso.</h2>
          </div>

          <div class="card-grid-3">
            <article class="process-card">
              <span class="step-index">01</span>
              <h3>Relevamiento</h3>
              <p>Se toma el caso, la urgencia, el volumen y el contexto operativo o administrativo de la consulta.</p>
            </article>
            <article class="process-card">
              <span class="step-index">02</span>
              <h3>Servicio correcto</h3>
              <p>Se define si conviene selecci&oacute;n, tercerizaci&oacute;n, payroll o asesoramiento log&iacute;stico.</p>
            </article>
            <article class="process-card">
              <span class="step-index">03</span>
              <h3>Seguimiento</h3>
              <p>La empresa recibe una respuesta clara, prioridades mejor definidas y un pr&oacute;ximo paso concreto.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header">
          <p class="eyebrow">Servicios</p>
          <h2 class="section-title wide">Cuatro caminos diferenciados para que la empresa no tenga que adivinar por d&oacute;nde empezar.</h2>
        </div>

        <div class="card-grid-4">
          <article class="process-card">
            <span class="step-index">01</span>
            <h3>Selecci&oacute;n de personal</h3>
            <p>Cuando la prioridad es incorporar mejor, relevar bien el perfil y decidir con m&aacute;s respaldo.</p>
            <a class="text-link" href="seleccion-de-personal/">Ver servicio</a>
          </article>
          <article class="process-card">
            <span class="step-index">02</span>
            <h3>Tercerizaci&oacute;n de personal</h3>
            <p>Cuando el foco est&aacute; en cobertura, reemplazos, continuidad y flexibilidad operativa.</p>
            <a class="text-link" href="tercerizacion-de-personal/">Ver servicio</a>
          </article>
          <article class="process-card">
            <span class="step-index">03</span>
            <h3>Payroll</h3>
            <p>Cuando la carga administrativa del personal est&aacute; ocupando demasiado tiempo interno.</p>
            <a class="text-link" href="payroll/">Ver servicio</a>
          </article>
          <article class="process-card">
            <span class="step-index">04</span>
            <h3>Asesoramiento log&iacute;stico</h3>
            <p>Cuando el problema aparece en stock, layout, picking, trazabilidad o flujo operativo.</p>
            <a class="text-link" href="asesoramiento-logistico/">Ver servicio</a>
          </article>
        </div>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="card-grid-2">
            <article class="metal-card">
              <p class="card-kicker">Qu&eacute; conviene dejar claro</p>
              <ul class="summary-list">
                <li>Tipo de necesidad y frente que hoy parece m&aacute;s cercano.</li>
                <li>Ciudad o zona, volumen estimado y urgencia actual.</li>
                <li>Si el problema impacta sobre incorporaci&oacute;n, continuidad, administraci&oacute;n o flujo operativo.</li>
              </ul>
            </article>

            <article class="metal-card">
              <p class="card-kicker">Qu&eacute; gana la empresa</p>
              <h3>Una primera lectura m&aacute;s ordenada, mejor criterio para definir el servicio y un inicio comercial sin ruido.</h3>
              <p>El objetivo es ahorrar vueltas, no sumar burocracia antes de empezar.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="consulta-empresa">
      <div class="container form-layout">
        <article class="form-card">
          <p class="eyebrow">Formulario para empresas</p>
          <h3>Dej&aacute; la consulta y armamos un primer intercambio claro.</h3>
          <p>Con algunos datos concretos ya se puede definir prioridad, servicio y siguiente paso.</p>

          <form class="form-grid" data-contact-form method="POST">
            <input type="hidden" name="_subject" value="Consulta web - Empresas - Valor Humano" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_next" value="" />
            <input type="text" name="_honey" tabindex="-1" autocomplete="off" class="hp-field" />

            <div class="field">
              <label for="empresa-nombre">Nombre y apellido</label>
              <input id="empresa-nombre" name="nombre" type="text" autocomplete="name" required />
            </div>

            <div class="field">
              <label for="empresa-empresa">Empresa</label>
              <input id="empresa-empresa" name="empresa" type="text" autocomplete="organization" required />
            </div>

            <div class="field">
              <label for="empresa-cargo">Cargo</label>
              <input id="empresa-cargo" name="cargo" type="text" autocomplete="organization-title" required />
            </div>

            <div class="field">
              <label for="empresa-telefono">Tel&eacute;fono o WhatsApp</label>
              <input id="empresa-telefono" name="telefono" type="tel" autocomplete="tel" required />
            </div>

            <div class="field">
              <label for="empresa-email">Correo electr&oacute;nico</label>
              <input id="empresa-email" name="email" type="email" autocomplete="email" required />
            </div>

            <div class="field">
              <label for="empresa-zona">Ciudad o zona</label>
              <input id="empresa-zona" name="ciudad" type="text" autocomplete="address-level2" required />
            </div>

            <div class="field full">
              <label for="empresa-servicio">Servicio de inter&eacute;s</label>
              <select id="empresa-servicio" name="servicio" required>
                <option value="">Seleccionar servicio</option>
                <option value="Selecci&oacute;n de personal">Selecci&oacute;n de personal</option>
                <option value="Tercerizaci&oacute;n de personal">Tercerizaci&oacute;n de personal</option>
                <option value="Payroll">Payroll</option>
                <option value="Asesoramiento log&iacute;stico">Asesoramiento log&iacute;stico</option>
                <option value="Todav&iacute;a no est&aacute; definido">Todav&iacute;a no est&aacute; definido</option>
              </select>
            </div>

            <div class="field full">
              <label for="empresa-necesidad">Tipo de necesidad</label>
              <input id="empresa-necesidad" name="tipo_necesidad" type="text" placeholder="Incorporaci&oacute;n, cobertura, n&oacute;mina, revisi&oacute;n operativa..." required />
            </div>

            <div class="field full">
              <label for="empresa-mensaje">Mensaje</label>
              <textarea id="empresa-mensaje" name="mensaje" placeholder="Contanos brevemente qu&eacute; est&aacute; pasando hoy y qu&eacute; necesit&aacute;s resolver." required></textarea>
            </div>

            <div class="field full">
              <div class="button-row">
                <button class="btn btn-primary" type="submit">Enviar consulta</button>
              </div>
            </div>
          </form>
        </article>

        <aside class="contact-rail">
          <p class="eyebrow">Antes de enviar</p>
          <h3>Conviene dejar el problema concreto, el volumen estimado y la urgencia actual.</h3>

          <div class="contact-list">
            <div>
              <strong>Qu&eacute; ayuda a definir mejor el caso</strong>
              <span>Tipo de necesidad, ciudad o zona, volumen estimado y prioridad actual.</span>
            </div>
            <a href="mailto:contacto@valorhumano.com.uy">
              <strong>Correo institucional</strong>
              <span>contacto@valorhumano.com.uy</span>
            </a>
            <div>
              <strong>Cobertura</strong>
              <span>Colonia del Sacramento y zonas de trabajo cercanas seg&uacute;n necesidad.</span>
            </div>
            <div>
              <strong>Horario</strong>
              <span>Lunes a viernes | 8:00 a 18:00</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
'@

$jobsBody = @'
    <section class="hero">
      <div class="container">
        <div class="hero-shell">
          <div class="hero-main">
            <div class="hero-badge-row">
              <p class="eyebrow">Empleos</p>
              <span class="hero-chip">Postulaci&oacute;n guiada</span>
            </div>
            <h1 class="hero-title">Postulaci&oacute;n ordenada para llamados activos, con referencia clara y CV adjunto.</h1>
            <p class="hero-lead">Ac&aacute; pod&eacute;s dejar la referencia del llamado, el puesto, la localidad y tus datos principales sin mezclar la postulaci&oacute;n con el recorrido comercial del sitio.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#postularme">Postularme</a>
              <a class="btn btn-secondary" href="contacto/">Consultas</a>
            </div>
          </div>

          <div class="hero-side">
            <figure class="hero-media">
              <img src="assets/media/jobs-hero.jpg" alt="Entrevista laboral dentro de un proceso de postulaci&oacute;n" />
            </figure>
            <article class="hero-note">
              <p class="card-kicker">Qu&eacute; completar</p>
              <h3>Referencia del llamado, puesto, localidad, datos de contacto y el CV correspondiente al perfil.</h3>
              <div class="tag-row">
                <span class="chip">Referencia</span>
                <span class="chip">Puesto</span>
                <span class="chip">Localidad</span>
                <span class="chip">CV adjunto</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section-soft">
      <div class="container">
        <div class="section-shell">
          <div class="section-header">
            <p class="eyebrow">C&oacute;mo funciona</p>
            <h2 class="section-title wide">Tres pasos breves para que la postulaci&oacute;n llegue mejor ordenada desde el inicio.</h2>
          </div>

          <div class="card-grid-3">
            <article class="process-card">
              <span class="step-index">01</span>
              <h3>Us&aacute; la referencia correcta</h3>
              <p>Indic&aacute; el llamado, el puesto y la localidad tal como aparecen en la publicaci&oacute;n.</p>
            </article>
            <article class="process-card">
              <span class="step-index">02</span>
              <h3>Dej&aacute; tus datos principales</h3>
              <p>Nombre, contacto y localidad ayudan a encuadrar r&aacute;pido la postulaci&oacute;n.</p>
            </article>
            <article class="process-card">
              <span class="step-index">03</span>
              <h3>Adjunt&aacute; el CV</h3>
              <p>Pod&eacute;s enviarlo por formulario o continuar la postulaci&oacute;n por WhatsApp con el archivo listo para adjuntar.</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="postularme">
      <div class="container">
        <article class="form-card narrow-shell">
          <p class="eyebrow">Formulario de postulaci&oacute;n</p>
          <h3>Complet&aacute; la referencia y envi&aacute; tu CV.</h3>
          <p>Si el llamado sigue activo, la postulaci&oacute;n queda registrada con la informaci&oacute;n necesaria para continuar.</p>

          <form class="form-grid" data-jobs-form method="POST" enctype="multipart/form-data">
            <input type="hidden" name="_subject" value="Postulaci&oacute;n web - Valor Humano" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_next" value="" />
            <input type="hidden" name="_url" value="" data-form-url />
            <input type="text" name="_honey" tabindex="-1" autocomplete="off" class="hp-field" />

            <div class="field">
              <label for="postulacion-nombre">Nombre y apellido</label>
              <input id="postulacion-nombre" name="nombre" type="text" autocomplete="name" required />
            </div>

            <div class="field">
              <label for="postulacion-telefono">Tel&eacute;fono o WhatsApp</label>
              <input id="postulacion-telefono" name="telefono" type="tel" autocomplete="tel" required />
            </div>

            <div class="field">
              <label for="postulacion-email">Correo electr&oacute;nico</label>
              <input id="postulacion-email" name="email" type="email" autocomplete="email" required />
            </div>

            <div class="field">
              <label for="postulacion-localidad">Localidad</label>
              <input id="postulacion-localidad" name="localidad" type="text" autocomplete="address-level2" required />
            </div>

            <div class="field full">
              <label for="postulacion-referencia">Referencia del llamado</label>
              <input id="postulacion-referencia" name="referencia" type="text" required />
            </div>

            <div class="field full">
              <label for="postulacion-puesto">Puesto al que te postul&aacute;s</label>
              <input id="postulacion-puesto" name="puesto" type="text" required />
            </div>

            <div class="field full">
              <label for="postulacion-cv">Adjuntar CV</label>
              <input id="postulacion-cv" name="attachment" type="file" accept=".pdf,.doc,.docx" required />
            </div>

            <p class="helper-copy full">Formatos admitidos: PDF, DOC o DOCX. Si eleg&iacute;s WhatsApp, el CV se adjunta en el siguiente paso por ese canal.</p>

            <div class="field full">
              <label for="postulacion-mensaje">Mensaje opcional</label>
              <textarea id="postulacion-mensaje" name="mensaje" placeholder="Pod&eacute;s agregar una aclaraci&oacute;n breve sobre disponibilidad o experiencia."></textarea>
            </div>

            <div class="field full">
              <div class="button-row">
                <button class="btn btn-primary" type="submit">Enviar postulaci&oacute;n</button>
                <button class="btn btn-secondary" type="button" data-channel="whatsapp">Postular por WhatsApp</button>
              </div>
            </div>
          </form>
        </article>
      </div>
    </section>
'@

$contactBody = @'
    <section class="hero hero-compact">
      <div class="container">
        <div class="hero-shell">
          <div class="hero-main">
            <div class="hero-badge-row">
              <p class="eyebrow">Contacto</p>
              <span class="hero-chip">Canales institucionales</span>
            </div>
            <h1 class="hero-title">Canales claros e institucionales para iniciar la consulta.</h1>
            <p class="hero-lead">Si necesit&aacute;s conversar sobre selecci&oacute;n, tercerizaci&oacute;n, payroll o asesoramiento log&iacute;stico, ac&aacute; encontr&aacute;s los medios visibles para hacerlo sin exponer datos personales.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#consulta">Ir al formulario</a>
              <a class="btn btn-secondary" href="#" data-wa-link data-wa-message="Hola Valor Humano, quiero hacer una consulta." rel="noreferrer">Hablar por WhatsApp</a>
            </div>
          </div>

          <div class="hero-side">
            <figure class="hero-media">
              <img src="assets/media/contact-meeting.jpg" alt="Reuni&oacute;n profesional para ordenar una consulta empresarial" />
            </figure>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="contact-methods">
          <article class="contact-method">
            <p class="card-kicker">WhatsApp</p>
            <strong>Canal directo</strong>
            <a href="#" data-wa-link data-wa-message="Hola Valor Humano, quiero hacer una consulta." rel="noreferrer">Iniciar conversaci&oacute;n</a>
          </article>
          <article class="contact-method">
            <p class="card-kicker">Correo institucional</p>
            <strong>contacto@valorhumano.com.uy</strong>
            <a href="mailto:contacto@valorhumano.com.uy">Escribir correo</a>
          </article>
          <article class="contact-method">
            <p class="card-kicker">Selecci&oacute;n</p>
            <strong>seleccion@valorhumano.com.uy</strong>
            <a href="mailto:seleccion@valorhumano.com.uy">Enviar consulta</a>
          </article>
          <article class="contact-method">
            <p class="card-kicker">Cobertura</p>
            <strong>Colonia del Sacramento</strong>
            <span>Atenci&oacute;n profesional para empresas y consultas vinculadas a la zona.</span>
          </article>
          <article class="contact-method">
            <p class="card-kicker">Horario</p>
            <strong>Lunes a viernes</strong>
            <span>8:00 a 18:00</span>
          </article>
          <article class="contact-method">
            <p class="card-kicker">Redes</p>
            <strong>Instagram y Facebook</strong>
            <div class="social-row">
              <a class="social-link" href="https://www.instagram.com/humano_valor?igsh=dDNteng3dHF6cWFy" target="_blank" rel="noreferrer">Instagram</a>
              <a class="social-link" href="https://www.facebook.com/profile.php?id=61572000190463&sk=directory_intro" target="_blank" rel="noreferrer">Facebook</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section-soft" id="consulta">
      <div class="container form-layout">
        <article class="form-card">
          <p class="eyebrow">Formulario</p>
          <h3>Dej&aacute; tu consulta y respondemos con una primera lectura clara.</h3>
          <p>Con algunos datos concretos ya se puede definir mejor por d&oacute;nde seguir.</p>

          <form class="form-grid" data-contact-form method="POST">
            <input type="hidden" name="_subject" value="Consulta web - Valor Humano" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_next" value="" />
            <input type="text" name="_honey" tabindex="-1" autocomplete="off" class="hp-field" />

            <div class="field">
              <label for="contacto-nombre">Nombre y apellido</label>
              <input id="contacto-nombre" name="nombre" type="text" autocomplete="name" required />
            </div>

            <div class="field">
              <label for="contacto-empresa">Empresa</label>
              <input id="contacto-empresa" name="empresa" type="text" autocomplete="organization" />
            </div>

            <div class="field">
              <label for="contacto-telefono">Tel&eacute;fono o WhatsApp</label>
              <input id="contacto-telefono" name="telefono" type="tel" autocomplete="tel" required />
            </div>

            <div class="field">
              <label for="contacto-email">Correo electr&oacute;nico</label>
              <input id="contacto-email" name="email" type="email" autocomplete="email" required />
            </div>

            <div class="field full">
              <label for="contacto-servicio">Servicio</label>
              <select id="contacto-servicio" name="servicio" required>
                <option value="">Seleccionar servicio</option>
                <option value="Selecci&oacute;n de personal">Selecci&oacute;n de personal</option>
                <option value="Tercerizaci&oacute;n de personal">Tercerizaci&oacute;n de personal</option>
                <option value="Payroll">Payroll</option>
                <option value="Asesoramiento log&iacute;stico">Asesoramiento log&iacute;stico</option>
                <option value="Consulta general">Consulta general</option>
              </select>
            </div>

            <div class="field full">
              <label for="contacto-mensaje">Mensaje</label>
              <textarea id="contacto-mensaje" name="mensaje" placeholder="Contanos brevemente qu&eacute; necesit&aacute;s resolver." required></textarea>
            </div>

            <div class="field full">
              <div class="button-row">
                <button class="btn btn-primary" type="submit">Enviar consulta</button>
              </div>
            </div>
          </form>
        </article>

        <aside class="contact-rail">
          <p class="eyebrow">Canales visibles</p>
          <h3>Una p&aacute;gina de contacto directa, institucional y pensada para convertir sin ruido.</h3>

          <div class="contact-list">
            <a href="#" data-wa-link data-wa-message="Hola Valor Humano, quiero hacer una consulta." rel="noreferrer">
              <strong>WhatsApp Valor Humano</strong>
              <span>Canal directo</span>
            </a>
            <a href="mailto:contacto@valorhumano.com.uy">
              <strong>Correo institucional</strong>
              <span>contacto@valorhumano.com.uy</span>
            </a>
            <a href="mailto:seleccion@valorhumano.com.uy">
              <strong>Correo de selecci&oacute;n</strong>
              <span>seleccion@valorhumano.com.uy</span>
            </a>
            <div>
              <strong>Ubicaci&oacute;n</strong>
              <span>Colonia del Sacramento</span>
            </div>
            <div>
              <strong>Horario</strong>
              <span>Lunes a viernes | 8:00 a 18:00</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
'@

$notFoundBody = @'
    <section class="empty-state">
      <div class="container">
        <div class="hero-shell">
          <div class="hero-main">
            <div class="hero-badge-row">
              <p class="eyebrow">404</p>
              <span class="hero-chip">Ruta no encontrada</span>
            </div>
            <h1 class="hero-title">La p&aacute;gina que buscabas no est&aacute; disponible.</h1>
            <p class="hero-lead">Pod&eacute;s volver al inicio, ir a Empresas o usar Contacto para continuar por una ruta clara.</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="./">Volver al inicio</a>
              <a class="btn btn-secondary" href="contacto/">Ir a contacto</a>
            </div>
          </div>

          <div class="hero-side">
            <article class="hero-note">
              <p class="card-kicker">Accesos principales</p>
              <h3>Us&aacute; Inicio, Empresas, Empleos o Contacto para seguir navegando el sitio sin depender de enlaces viejos.</h3>
              <div class="tag-row">
                <span class="chip">Inicio</span>
                <span class="chip">Empresas</span>
                <span class="chip">Empleos</span>
                <span class="chip">Contacto</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
'@

$pages = @{
  'index.html' = (Get-Page 'Valor Humano | Selecci&oacute;n, payroll y operaci&oacute;n con criterio' 'Valor Humano acompa&ntilde;a empresas con selecci&oacute;n de personal, tercerizaci&oacute;n, payroll y asesoramiento log&iacute;stico desde una mirada clara, sobria y profesional.' 'page-home' 'home' '' $indexBody)
  'nosotros/index.html' = (Get-Page 'Nosotros | Valor Humano' 'Valor Humano combina cercan&iacute;a profesional, criterio y una lectura pr&aacute;ctica para acompa&ntilde;ar decisiones de personal y operaci&oacute;n.' 'page-about' 'about' "  <base href=""../"" />`r`n" $aboutBody)
  'seleccion-de-personal/index.html' = (Get-Page 'Selecci&oacute;n de personal | Valor Humano' 'Relevamiento del perfil, filtro, entrevistas, referencias y acompa&ntilde;amiento para incorporar con mejor criterio y menos riesgo.' 'page-selection' 'selection' "  <base href=""../"" />`r`n" $selectionBody)
  'tercerizacion-de-personal/index.html' = (Get-Page 'Tercerizaci&oacute;n de personal | Valor Humano' 'Cobertura, reemplazos, picos de actividad y continuidad operativa con menor carga interna y mejor coordinaci&oacute;n.' 'page-outsourcing' 'outsourcing' "  <base href=""../"" />`r`n" $outsourcingBody)
  'payroll/index.html' = (Get-Page 'Payroll | Valor Humano' 'Altas, bajas, liquidaciones, documentaci&oacute;n y seguimiento administrativo para descargar a la empresa de la gesti&oacute;n diaria de la n&oacute;mina.' 'page-payroll' 'payroll' "  <base href=""../"" />`r`n" $payrollBody)
  'asesoramiento-logistico/index.html' = (Get-Page 'Asesoramiento log&iacute;stico | Valor Humano' 'Revisi&oacute;n de stock, layout, picking, trazabilidad y flujo operativo para mejorar orden y visibilidad.' 'page-logistics' 'logistics' "  <base href=""../"" />`r`n" $logisticsBody)
  'empresas/index.html' = (Get-Page 'Empresas | Valor Humano' 'Una entrada comercial clara para ordenar la necesidad y definir si conviene selecci&oacute;n, tercerizaci&oacute;n, payroll o asesoramiento log&iacute;stico.' 'page-enterprises' 'enterprises' "  <base href=""../"" />`r`n" $enterprisesBody)
  'empleos/index.html' = (Get-Page 'Empleos | Valor Humano' 'Postulaci&oacute;n guiada para llamados activos, con referencia, puesto, localidad, formulario y WhatsApp con CV adjunto.' 'page-jobs' 'jobs' "  <base href=""../"" />`r`n" $jobsBody)
  'contacto/index.html' = (Get-Page 'Contacto | Valor Humano' 'WhatsApp, correo institucional, redes y formulario para consultas sobre selecci&oacute;n, tercerizaci&oacute;n, payroll y orden operativo.' 'page-contact' 'contact' "  <base href=""../"" />`r`n" $contactBody)
  '404.html' = (Get-Page '404 | Valor Humano' '404 | Valor Humano. Ruta no encontrada.' 'page-404' '' '' $notFoundBody 'noindex, nofollow')
}

foreach ($entry in $pages.GetEnumerator()) {
  $target = Join-Path $root $entry.Key
  Set-Content -LiteralPath $target -Value $entry.Value -Encoding UTF8
}

$redirects = @{
  'nosotros.html' = (Get-RedirectPage 'Nosotros | Redirecci&oacute;n' 'nosotros/')
  'seleccion.html' = (Get-RedirectPage 'Selecci&oacute;n de personal | Redirecci&oacute;n' 'seleccion-de-personal/')
  'tercerizacion.html' = (Get-RedirectPage 'Tercerizaci&oacute;n de personal | Redirecci&oacute;n' 'tercerizacion-de-personal/')
  'payroll.html' = (Get-RedirectPage 'Payroll | Redirecci&oacute;n' 'payroll/')
  'asesoramiento-logistico.html' = (Get-RedirectPage 'Asesoramiento log&iacute;stico | Redirecci&oacute;n' 'asesoramiento-logistico/')
  'soluciones-operativas.html' = (Get-RedirectPage 'Asesoramiento log&iacute;stico | Redirecci&oacute;n' 'asesoramiento-logistico/')
  'empresas.html' = (Get-RedirectPage 'Empresas | Redirecci&oacute;n' 'empresas/')
  'empleos.html' = (Get-RedirectPage 'Empleos | Redirecci&oacute;n' 'empleos/')
  'contacto.html' = (Get-RedirectPage 'Contacto | Redirecci&oacute;n' 'contacto/')
}

foreach ($entry in $redirects.GetEnumerator()) {
  $target = Join-Path $root $entry.Key
  Set-Content -LiteralPath $target -Value $entry.Value -Encoding UTF8
}

$robots = @'
User-agent: *
Allow: /
'@

Set-Content -LiteralPath (Join-Path $root 'robots.txt') -Value $robots -Encoding UTF8
