const whatsappNumber = ["598", "9880", "3512"].join("");
const defaultFormRecipient = ["jhonatan", "stemphelet"].join("-") + "@" + String.fromCharCode(104, 111, 116, 109, 97, 105, 108) + "." + "com";
const jobsFormRecipient = "seleccion@valorhumano.com.uy";
const allowedCvExtensions = [".pdf", ".doc", ".docx"];
const maxCvSizeBytes = 10 * 1024 * 1024;

function getCleanUrl() {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  return url.toString();
}

function openWhatsApp(message) {
  const text = message || "Hola Valor Humano, quiero hacer una consulta.";
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
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

  if (!toggle || !panel) return;

  const closeNav = () => {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open")) return;
    const clickedInside = panel.contains(event.target) || toggle.contains(event.target);
    if (!clickedInside) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeNav();
  });
}

function setupReveal() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

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

  elements.forEach((element) => observer.observe(element));
}

function setupWhatsAppLinks() {
  document.querySelectorAll("[data-wa-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openWhatsApp(link.dataset.waMessage);
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

function getRecipient(kind) {
  if (kind === "jobs") return jobsFormRecipient;
  return defaultFormRecipient;
}

function setFormEndpoint(form) {
  const kind = form.dataset.formKind || "contact";
  form.action = `https://formsubmit.co/${getRecipient(kind)}`;
  form.method = "POST";
  if (kind === "jobs") form.enctype = "multipart/form-data";
}

function setNextUrl(form) {
  const nextField = form.querySelector('input[name="_next"]');
  if (!nextField) return;

  const successKey = form.dataset.successKey || "ok";
  nextField.value = `${getCleanUrl()}?${successKey}=ok`;
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
  form.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });

  if (submitButton) submitButton.textContent = "Enviando...";
}

function setupForms() {
  const forms = document.querySelectorAll("form[data-form-kind]");
  if (!forms.length) return;

  const currentUrl = new URL(window.location.href);

  forms.forEach((form) => {
    const showStatus = bindStatus(form);
    const successKey = form.dataset.successKey || "ok";

    setFormEndpoint(form);
    setNextUrl(form);

    if (currentUrl.searchParams.get(successKey) === "ok") {
      showStatus("success", "Tu mensaje fue enviado correctamente. En breve seguimos el contacto.");
    }

    form.addEventListener("submit", (event) => {
      if (!form.reportValidity()) {
        event.preventDefault();
        return;
      }

      if ((form.dataset.formKind || "") === "jobs") {
        const fileField = form.querySelector('input[type="file"]');
        const result = validateCv(fileField && fileField.files ? fileField.files[0] : null);

        if (!result.valid) {
          event.preventDefault();
          showStatus("error", result.message);
          return;
        }
      }

      setSubmittingState(form);
    });
  });
}

function setupJobsMailShortcut() {
  const button = document.querySelector("[data-jobs-mail]");
  if (!button) return;

  button.addEventListener("click", () => {
    const form = document.querySelector('form[data-form-kind="jobs"]');
    const name = form?.querySelector('input[name="Nombre y apellido"]')?.value?.trim() || "";
    const email = form?.querySelector('input[name="Correo"]')?.value?.trim() || "";
    const area = form?.querySelector('input[name="Area o rubro"]')?.value?.trim() || "";
    const body = [
      "Hola Valor Humano, comparto mi postulacion.",
      name ? `Nombre: ${name}` : "",
      email ? `Correo: ${email}` : "",
      area ? `Area o rubro: ${area}` : "",
      "",
      "Adjunto CV."
    ].filter(Boolean).join("\n");

    window.location.href = `mailto:${jobsFormRecipient}?subject=${encodeURIComponent("Postulacion Valor Humano")}&body=${encodeURIComponent(body)}`;
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
      timer = window.setInterval(nextSlide, 6500);
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
  setupHeader();
  setupNavigation();
  setupReveal();
  setupWhatsAppLinks();
  setupForms();
  setupJobsMailShortcut();
  setupSliders();
});
