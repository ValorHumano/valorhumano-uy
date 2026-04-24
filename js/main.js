const publicContactEmail = "contacto@valorhumano.com.uy";
const publicJobsEmail = "seleccion@valorhumano.com.uy";
const allowedCvExtensions = [".pdf", ".doc", ".docx"];
const maxCvSizeBytes = 10 * 1024 * 1024;
const formSuccessMessages = {
  contact: "Tu consulta fue enviada correctamente. En breve seguimos el contacto.",
  enterprise: "Tu consulta fue enviada correctamente. En breve seguimos el contacto.",
  jobs: "Tu postulacion fue enviada correctamente. En breve seguimos el contacto."
};

function getCleanUrl() {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  return url.toString();
}

function isLocalHost() {
  return window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
}

function getSiteBasePath() {
  if (isLocalHost()) return "/";

  if (window.location.hostname.endsWith("github.io")) {
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

function getWhatsAppEntryUrl(message) {
  const target = new URL("go/whatsapp", getSiteUrl(""));
  target.searchParams.set("text", message || "Hola Valor Humano, quiero hacer una consulta.");
  return target.toString();
}

function setupHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const sync = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".nav-panel");
  const submenuItems = Array.from(document.querySelectorAll(".has-submenu"));

  if (!toggle || !panel) return;

  const syncSubmenuState = (item, expanded) => {
    const button = item.querySelector(".submenu-toggle");
    if (!button) return;
    item.classList.toggle("is-open", expanded);
    button.setAttribute("aria-expanded", String(expanded));
  };

  const closeSubmenus = (exceptItem = null) => {
    submenuItems.forEach((item) => {
      if (item === exceptItem) return;
      syncSubmenuState(item, false);
    });
  };

  const closeNav = () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    closeSubmenus();
  };

  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
    if (!open) closeSubmenus();
  });

  submenuItems.forEach((item) => {
    const button = item.querySelector(".submenu-toggle");
    if (!button) return;

    button.addEventListener("click", (event) => {
      event.preventDefault();
      const willOpen = !item.classList.contains("is-open");
      closeSubmenus(item);
      syncSubmenuState(item, willOpen);
    });
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    const clickedInsidePanel = panel.contains(event.target);
    const clickedToggle = toggle.contains(event.target);
    const clickedSubmenu = submenuItems.some((item) => item.contains(event.target));

    if (!clickedSubmenu) closeSubmenus();

    if (!document.body.classList.contains("nav-open")) return;
    if (!clickedInsidePanel && !clickedToggle) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSubmenus();
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeNav();
    if (window.innerWidth > 1080) closeSubmenus();
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

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach((element) => {
    if (revealIfInView(element)) return;
    observer.observe(element);
  });
}

function setupWhatsAppLinks() {
  document.querySelectorAll("[data-wa-link]").forEach((link) => {
    link.href = getWhatsAppEntryUrl(link.dataset.waMessage);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

async function copyText(value) {
  if (!value) return false;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(value);
    return true;
  }

  const helper = document.createElement("textarea");
  helper.value = value;
  helper.setAttribute("readonly", "");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(helper);
  return copied;
}

function setupCopyEmailButtons() {
  document.querySelectorAll("[data-copy-email]").forEach((control) => {
    const originalLabel = control.textContent.trim();
    const copiedLabel = control.dataset.copiedLabel || "Correo copiado";

    control.addEventListener("click", async (event) => {
      event.preventDefault();

      try {
        const copied = await copyText(control.dataset.copyEmail || "");
        control.textContent = copied ? copiedLabel : originalLabel;
      } catch (error) {
        control.textContent = originalLabel;
      }

      window.setTimeout(() => {
        control.textContent = originalLabel;
      }, 1800);
    });
  });
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

function getPublicEmail(formKind) {
  return formKind === "jobs" ? publicJobsEmail : publicContactEmail;
}

function validateCv(file) {
  if (!file) {
    return { valid: false, message: "Adjunta tu CV para completar la postulacion." };
  }

  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedCvExtensions.some((extension) => fileName.endsWith(extension));

  if (!hasValidExtension) {
    return { valid: false, message: "El CV debe estar en formato PDF, DOC o DOCX." };
  }

  if (file.size > maxCvSizeBytes) {
    return { valid: false, message: "El archivo supera el maximo de 10 MB permitido." };
  }

  return { valid: true };
}

function setSubmittingState(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const buttons = Array.from(form.querySelectorAll("button"));
  const previousLabels = buttons.map((button) => button.textContent);

  buttons.forEach((button) => {
    button.disabled = true;
  });

  if (submitButton) submitButton.textContent = "Enviando...";

  return () => {
    buttons.forEach((button, index) => {
      button.disabled = false;
      if (typeof previousLabels[index] === "string") {
        button.textContent = previousLabels[index];
      }
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

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      if (formKind === "jobs") {
        const fileField = form.querySelector('input[type="file"]');
        const result = validateCv(fileField && fileField.files ? fileField.files[0] : null);
        if (!result.valid) {
          showStatus("error", result.message);
          return;
        }
      }

      const restoreState = setSubmittingState(form);
      const payload = new FormData(form);
      payload.set("_page", getCleanUrl());
      payload.set("_visible_contact", getPublicEmail(formKind));

      try {
        const response = await fetch(getFormEndpoint(form), {
          method: "POST",
          body: payload,
          headers: {
            Accept: "application/json"
          }
        });

        let data = null;

        try {
          data = await response.json();
        } catch (error) {
          data = null;
        }

        if (!response.ok || !data?.ok) {
          throw new Error(data?.message || "No se pudo enviar la consulta en este momento.");
        }

        if (!data.deliveryId) {
          throw new Error("No hubo confirmacion verificable del proveedor de correo.");
        }

        form.reset();
        showStatus("success", data.message || formSuccessMessages[formKind] || "Tu mensaje fue enviado correctamente.");
      } catch (error) {
        showStatus("error", error?.message || "No se pudo enviar la consulta en este momento. Proba nuevamente o escribinos al correo visible.");
      } finally {
        restoreState();
      }
    });
  });
}

function setupJobsMailShortcut() {
  const button = document.querySelector("[data-jobs-mail]");
  if (!button) return;

  const originalLabel = button.textContent.trim();

  button.addEventListener("click", async () => {
    try {
      const copied = await copyText(publicJobsEmail);
      button.textContent = copied ? "Correo copiado" : originalLabel;
    } catch (error) {
      button.textContent = originalLabel;
    }

    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 1800);
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

    const nextSlide = () => {
      goTo(index === slides.length - 1 ? 0 : index + 1);
    };

    const stopAuto = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };

    const startAuto = () => {
      stopAuto();
      timer = window.setInterval(nextSlide, 7600);
    };

    prev?.addEventListener("click", () => {
      goTo(index === 0 ? slides.length - 1 : index - 1);
    });

    next?.addEventListener("click", () => {
      nextSlide();
    });

    dots.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => {
        goTo(dotIndex);
      });
    });

    sync();
    startAuto();

    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);
    slider.addEventListener("focusin", stopAuto);
    slider.addEventListener("focusout", startAuto);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("js-enhanced");
  setupHeader();
  setupNavigation();
  setupReveal();
  setupWhatsAppLinks();
  setupCopyEmailButtons();
  setupForms();
  setupJobsMailShortcut();
  setupSliders();
});
