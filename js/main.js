const allowedCvExtensions = [".pdf", ".doc", ".docx"];
const maxCvSizeBytes = 10 * 1024 * 1024;
let toastTimer = null;

const formSuccessMessages = {
  contact: "Tu consulta fue enviada correctamente. En breve seguimos el contacto.",
  enterprise: "Tu consulta fue enviada correctamente. En breve seguimos el contacto.",
  jobs: "Tu postulación fue enviada correctamente. En breve seguimos el contacto."
};

const staticFallbackMessage = "Este canal operativo funciona solo en el sitio principal de Valor Humano.";

function isLocalHost() {
  return window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
}

function isGithubPagesHost() {
  return window.location.hostname.endsWith("github.io");
}

function getSiteBasePath() {
  if (isLocalHost()) return "/";
  if (isGithubPagesHost()) {
    const [repoSlug] = window.location.pathname.split("/").filter(Boolean);
    return repoSlug ? `/${repoSlug}/` : "/";
  }
  return "/";
}

function getSiteUrl(path = "") {
  return new URL(path.replace(/^\//, ""), `${window.location.origin}${getSiteBasePath()}`).toString();
}

function getApiUrl(path) {
  return getSiteUrl(path);
}

function getCleanUrl() {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  return url.toString();
}

function setupWhatsAppLinks() {
  document.querySelectorAll("[data-wa-link]").forEach((link) => {
    const message = (link.dataset.waMessage || "Hola Valor Humano, quiero hacer una consulta.").trim();
    const encoded = encodeURIComponent(message);
    link.href = `/go/whatsapp?text=${encoded}`;
    link.setAttribute("aria-label", "Abrir WhatsApp de Valor Humano");
    link.removeAttribute("target");
    link.removeAttribute("rel");
  });
}

function injectNavigationFixStyles() {
  if (document.getElementById("vh-navigation-fix")) return;

  const style = document.createElement("style");
  style.id = "vh-navigation-fix";
  style.textContent = `
    .site-header, .header-shell, .nav-panel, .nav-menu, .nav-menu > li { overflow: visible; }
    .nav-panel, .nav-menu { min-width: 0; }
    .nav-menu a, .submenu-toggle, .nav-cta { white-space: nowrap; }

    @media (min-width: 1241px) {
      .nav-menu { gap: clamp(12px, 1.15vw, 24px); }
      .brand-logo { width: min(100%, 228px); }
    }

    @media (max-width: 1240px) {
      .nav-toggle { display: inline-flex; }
      .nav-panel {
        position: fixed;
        top: 92px;
        right: 16px;
        left: 16px;
        z-index: 980;
        display: grid;
        align-items: stretch;
        justify-content: stretch;
        gap: 16px;
        max-height: calc(100vh - 116px);
        overflow: auto;
        padding: 18px;
        border: 1px solid rgba(202, 209, 216, 0.86);
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 24px 52px rgba(77, 88, 99, 0.18);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        pointer-events: none;
        transition: opacity 220ms ease, visibility 220ms ease, transform 220ms ease;
      }
      body.nav-open .nav-panel {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        pointer-events: auto;
      }
      .nav-menu {
        display: grid;
        align-items: stretch;
        justify-content: stretch;
        gap: 8px;
      }
      .nav-menu a, .submenu-toggle {
        width: 100%;
        min-height: 48px;
        padding: 10px 12px;
        border-radius: 14px;
      }
      .submenu-toggle { justify-content: space-between; }
      .has-submenu .submenu-panel {
        position: static;
        left: auto;
        display: none;
        min-width: 0;
        margin: 4px 0 0;
        padding: 6px;
        border-radius: 16px;
        background: rgba(247, 244, 238, 0.96);
        box-shadow: none;
        opacity: 1;
        visibility: visible;
        transform: none;
        pointer-events: auto;
      }
      .has-submenu.is-open .submenu-panel { display: grid; }
      .nav-cta { width: 100%; }
    }
  `;
  document.head.appendChild(style);
}

function injectTitleBalanceStyles() {
  if (document.getElementById("vh-title-balance")) return;

  const link = document.createElement("link");
  link.id = "vh-title-balance";
  link.rel = "stylesheet";
  link.href = "/css/title-balance.css?v=20260429-title-balance-all";
  document.head.appendChild(link);
}

function setupTitleBalance() {
  injectTitleBalanceStyles();

  const selectors = [
    ".hero-title",
    ".page-title",
    ".section-title",
    ".hero-panel h2",
    ".service-card h3",
    ".detail-card h3",
    ".process-card h3",
    ".audience-card h3",
    ".channel-card h3",
    ".contact-card h3",
    ".support-card h3",
    ".principle-card h3",
    ".team-card h3",
    ".sector-card h3"
  ];

  document.querySelectorAll(selectors.join(", ")).forEach((title) => {
    title.classList.add("title-balanced");
  });
}

function setupHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const sync = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

function setupNavigation() {
  injectNavigationFixStyles();

  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".nav-panel");
  const submenuItems = Array.from(document.querySelectorAll(".has-submenu"));

  if (!toggle || !panel) return;

  const setSubmenu = (item, open) => {
    const button = item.querySelector(".submenu-toggle");
    item.classList.toggle("is-open", open);
    if (button) button.setAttribute("aria-expanded", String(open));
  };

  const closeSubmenus = (exceptItem = null) => {
    submenuItems.forEach((item) => {
      if (item !== exceptItem) setSubmenu(item, false);
    });
  };

  const closeNav = () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    closeSubmenus();
  };

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
    if (!open) closeSubmenus();
  });

  submenuItems.forEach((item) => {
    const button = item.querySelector(".submenu-toggle");
    if (!button) return;

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const open = !item.classList.contains("is-open");
      closeSubmenus(item);
      setSubmenu(item, open);
    });
  });

  panel.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

  document.addEventListener("click", (event) => {
    const insidePanel = panel.contains(event.target);
    const insideToggle = toggle.contains(event.target);
    const insideSubmenu = submenuItems.some((item) => item.contains(event.target));

    if (!insideSubmenu) closeSubmenus();
    if (document.body.classList.contains("nav-open") && !insidePanel && !insideToggle) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1240) closeNav();
  });
}

function setupReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  const revealIfInView = (element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      element.classList.add("is-visible");
      return true;
    }
    return false;
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });

  elements.forEach((element) => {
    if (!revealIfInView(element)) observer.observe(element);
  });
}

function ensureToast() {
  let feedback = document.querySelector(".copy-feedback");
  if (feedback) return feedback;

  feedback = document.createElement("p");
  feedback.className = "copy-feedback";
  feedback.setAttribute("role", "status");
  feedback.setAttribute("aria-live", "polite");
  document.body.appendChild(feedback);
  return feedback;
}

function showToast(message, status = "success") {
  const feedback = ensureToast();
  feedback.textContent = message;
  feedback.dataset.status = status;
  feedback.classList.add("is-visible");

  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => feedback.classList.remove("is-visible"), 2200);
}

function setupContactPrefill() {
  const params = new URLSearchParams(window.location.search);
  const motivo = params.get("motivo");
  if (!motivo) return;

  const form = document.querySelector('form[data-form-kind="contact"]');
  if (!form) return;

  const motivoField = form.querySelector('[name="Motivo"]');
  const mensajeField = form.querySelector('[name="Mensaje"]');

  if (motivoField && !motivoField.value) {
    const matchingOption = Array.from(motivoField.options || []).find((option) => option.textContent === motivo || option.value === motivo);
    if (matchingOption) motivoField.value = matchingOption.value;
  }

  if (mensajeField && !mensajeField.value) {
    mensajeField.value = motivo;
  }

  const target = document.getElementById("formulario-contacto") || form;
  window.setTimeout(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);
}

function bindStatus(form) {
  const host = form.closest(".form-card") || form.parentElement;
  if (!host) return () => {};

  let status = host.querySelector(".form-success, .form-error");

  return (type, message) => {
    if (!status) {
      status = document.createElement("p");
      host.appendChild(status);
    }
    status.className = type === "error" ? "form-error" : "form-success";
    status.setAttribute("aria-live", "polite");
    status.textContent = message;
  };
}

function getFormEndpoint(form) {
  const kind = form.dataset.formKind || "contact";
  return getApiUrl(`api/forms/${kind}`);
}

function validateCv(file) {
  if (!file) return { valid: false, message: "Adjunta tu CV para completar la postulacion." };

  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedCvExtensions.some((extension) => fileName.endsWith(extension));

  if (!hasValidExtension) return { valid: false, message: "El CV debe estar en formato PDF, DOC o DOCX." };
  if (file.size > maxCvSizeBytes) return { valid: false, message: "El archivo supera el maximo de 10 MB permitido." };

  return { valid: true };
}

function setSubmittingState(form) {
  const buttons = Array.from(form.querySelectorAll("button"));
  const labels = buttons.map((button) => button.textContent);
  const submitButton = form.querySelector('button[type="submit"]');

  buttons.forEach((button) => { button.disabled = true; });
  if (submitButton) submitButton.textContent = "Enviando...";

  return () => {
    buttons.forEach((button, index) => {
      button.disabled = false;
      if (typeof labels[index] === "string") button.textContent = labels[index];
    });
  };
}

function setupForms() {
  const forms = document.querySelectorAll("form[data-form-kind]");
  if (!forms.length) return;

  forms.forEach((form) => {
    const showStatus = bindStatus(form);
    const formKind = form.dataset.formKind || "contact";

    form.action = getFormEndpoint(form);
    form.method = "POST";
    if (formKind === "jobs") form.enctype = "multipart/form-data";

    if (isGithubPagesHost()) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        showStatus("error", staticFallbackMessage);
      });
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      if (formKind === "jobs") {
        const fileField = form.querySelector('input[type="file"]');
        const result = validateCv(fileField?.files?.[0]);
        if (!result.valid) {
          showStatus("error", result.message);
          return;
        }
      }

      const restoreState = setSubmittingState(form);
      const payload = new FormData(form);
      payload.set("_page", getCleanUrl());

      try {
        const response = await fetch(getFormEndpoint(form), {
          method: "POST",
          body: payload,
          headers: { Accept: "application/json" }
        });

        let data = null;
        try { data = await response.json(); } catch (error) { data = null; }

        if (!response.ok || !data?.ok) throw new Error(data?.message || "No se pudo enviar la consulta en este momento.");

        form.reset();
        showStatus("success", data.message || formSuccessMessages[formKind] || "Tu mensaje fue enviado correctamente.");
      } catch (error) {
        showStatus("error", error?.message || "No se pudo enviar la consulta en este momento. Proba nuevamente mas tarde.");
      } finally {
        restoreState();
      }
    });
  });
}

function setupSliders() {
  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const track = slider.querySelector("[data-slider-track]");
    const slides = Array.from(slider.querySelectorAll("[data-slide]"));
    const dots = Array.from(slider.querySelectorAll("[data-slide-dot]"));
    const prev = slider.querySelector("[data-slider-prev]");
    const next = slider.querySelector("[data-slider-next]");

    if (!track || slides.length < 2) return;

    let index = 0;
    let timer = null;

    const sync = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === index);
        dot.setAttribute("aria-pressed", String(dotIndex === index));
      });
    };

    const goTo = (nextIndex) => {
      index = nextIndex;
      sync();
    };

    const nextSlide = () => goTo(index === slides.length - 1 ? 0 : index + 1);
    const stopAuto = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };
    const startAuto = () => {
      stopAuto();
      timer = window.setInterval(nextSlide, 7600);
    };

    prev?.addEventListener("click", () => goTo(index === 0 ? slides.length - 1 : index - 1));
    next?.addEventListener("click", nextSlide);
    dots.forEach((dot, dotIndex) => dot.addEventListener("click", () => goTo(dotIndex)));

    sync();
    startAuto();
    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);
    slider.addEventListener("focusin", stopAuto);
    slider.addEventListener("focusout", startAuto);
  });
}

function prefillFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const motivo = urlParams.get('motivo');
  if (motivo) {
    const textarea = document.querySelector('textarea[name="Mensaje"]');
    if (textarea && !textarea.value.trim()) {
      textarea.value = motivo;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-enhanced");
  setupTitleBalance();
  setupHeader();
  setupNavigation();
  setupReveal();
  setupWhatsAppLinks();
  setupContactPrefill();
  setupForms();
  setupSliders();
  prefillFromUrl();
});
