const whatsappNumber = "59898803512";
const defaultFormRecipient = "contacto@valorhumano.com.uy";
const jobsFormRecipient = "seleccion@valorhumano.com.uy";
const allowedCvExtensions = [".pdf", ".doc", ".docx"];
const maxCvSizeBytes = 10 * 1024 * 1024;

function setupReadyState() {
  requestAnimationFrame(() => {
    document.body.classList.add("is-loaded");
  });
}

function setupHeaderState() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const syncHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

function toggleNavigation() {
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
    if (panel.contains(event.target) || toggle.contains(event.target)) return;
    closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeNav();
  });
}

function normalizeValue(value) {
  if (!value) return "No indicado";
  const normalized = String(value).trim();
  return normalized || "No indicado";
}

function getCurrentPageUrl() {
  const currentUrl = new URL(window.location.href);
  currentUrl.search = "";
  currentUrl.hash = "";
  return currentUrl.toString();
}

function bindFormStatus(form, { placement = "append" } = {}) {
  let statusNotice = form.parentElement
    ? form.parentElement.querySelector(".form-success, .form-error")
    : null;

  return (type, message) => {
    if (!form.parentElement) return;

    if (!statusNotice) {
      statusNotice = document.createElement("p");
      statusNotice.setAttribute("aria-live", "polite");
      if (placement === "before") {
        form.parentElement.insertBefore(statusNotice, form);
      } else {
        form.parentElement.appendChild(statusNotice);
      }
    }

    statusNotice.className = type === "error" ? "form-error" : "form-success";
    statusNotice.textContent = message;
  };
}

function getFormRecipient(form) {
  if (form.matches("[data-jobs-form]")) return jobsFormRecipient;
  return form.dataset.formRecipient || defaultFormRecipient;
}

function applyFormEndpoint(form) {
  form.action = `https://formsubmit.co/${getFormRecipient(form)}`;
  form.method = "POST";
}

function prepareNextField(form, key) {
  const nextField = form.querySelector('input[name="_next"]');
  if (!nextField) return;
  nextField.value = `${getCurrentPageUrl()}?${key}=enviada`;
}

function setSubmittingState(buttons, submitButton, label) {
  buttons.forEach((button) => {
    button.disabled = true;
  });

  if (submitButton) {
    submitButton.textContent = label;
  }
}

function validateCvFile(file) {
  if (!file) {
    return {
      valid: false,
      message: "Adjunta tu CV para completar la postulacion."
    };
  }

  const lowerName = file.name.toLowerCase();
  const hasAllowedExtension = allowedCvExtensions.some((extension) => lowerName.endsWith(extension));

  if (!hasAllowedExtension) {
    return {
      valid: false,
      message: "El CV debe estar en formato PDF, DOC o DOCX."
    };
  }

  if (file.size > maxCvSizeBytes) {
    return {
      valid: false,
      message: "El archivo supera el maximo de 10 MB permitido."
    };
  }

  return { valid: true };
}

function collectFormLines(form, options = {}) {
  const includeFiles = options.includeFiles || false;
  const lines = [];

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    if (!field.name || field.disabled) return;
    if (field.type === "button" || field.type === "submit" || field.type === "reset") return;
    if ((field.type === "checkbox" || field.type === "radio") && !field.checked) return;
    if (field.name.startsWith("_")) return;

    const wrapper = field.closest(".field");
    const label = wrapper && wrapper.querySelector("label")
      ? wrapper.querySelector("label").textContent.trim()
      : field.name;

    if (field.type === "file") {
      if (!includeFiles) return;
      const fileName = field.files && field.files[0] ? field.files[0].name : "Adjuntar manualmente";
      lines.push(`${label}: ${fileName}`);
      return;
    }

    lines.push(`${label}: ${normalizeValue(field.value)}`);
  });

  return lines;
}

function openWhatsApp(body) {
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(body)}`, "_blank", "noopener");
}

function setupWhatsAppLinks() {
  document.querySelectorAll("[data-wa-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openWhatsApp(link.dataset.waMessage || "Hola Valor Humano, quiero hacer una consulta.");
    });
  });
}

function setupContactForms() {
  const forms = document.querySelectorAll("[data-contact-form]");
  if (!forms.length) return;

  const currentUrl = new URL(window.location.href);

  forms.forEach((form) => {
    applyFormEndpoint(form);
    prepareNextField(form, "consulta");

    const submitButton = form.querySelector('button[type="submit"]');
    const actionButtons = form.querySelectorAll("button");

    form.addEventListener("submit", (event) => {
      if (!form.reportValidity()) {
        event.preventDefault();
        return;
      }

      setSubmittingState(actionButtons, submitButton, "Enviando...");
    });
  });

  if (currentUrl.searchParams.get("consulta") === "enviada") {
    forms.forEach((form) => {
      const showStatus = bindFormStatus(form);
      showStatus("success", "Tu consulta fue enviada correctamente. En breve continuamos el contacto.");
    });
  }
}

function setupJobsForm() {
  const form = document.querySelector("[data-jobs-form]");
  if (!form) return;

  applyFormEndpoint(form);
  form.enctype = "multipart/form-data";
  prepareNextField(form, "postulacion");

  const fileInput = form.querySelector('input[type="file"]');
  const referenceInput = form.querySelector('[name="referencia"]');
  const urlInput = form.querySelector("[data-form-url]");
  const subjectInput = form.querySelector('input[name="_subject"]');
  const submitButton = form.querySelector('button[type="submit"]');
  const actionButtons = form.querySelectorAll("button");
  const showStatus = bindFormStatus(form, { placement: "before" });
  const currentUrl = new URL(window.location.href);

  if (urlInput) {
    urlInput.value = window.location.href;
  }

  const syncSubject = () => {
    if (!subjectInput) return;
    const reference = referenceInput ? normalizeValue(referenceInput.value) : "Sin referencia";
    subjectInput.value = `Postulacion web - ${reference}`;
  };

  syncSubject();

  if (referenceInput) {
    referenceInput.addEventListener("input", syncSubject);
    referenceInput.addEventListener("change", syncSubject);
  }

  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const selectedFile = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

      if (!selectedFile) return;

      const validation = validateCvFile(selectedFile);
      if (!validation.valid) {
        fileInput.value = "";
        showStatus("error", validation.message);
      }
    });
  }

  if (currentUrl.searchParams.get("postulacion") === "enviada") {
    showStatus("success", "Tu postulacion fue enviada correctamente. Si el llamado sigue activo, vamos a continuar por los datos que dejaste.");
  }

  form.addEventListener("submit", (event) => {
    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }

    syncSubject();

    const cvFile = fileInput && fileInput.files ? fileInput.files[0] : null;
    const validation = validateCvFile(cvFile);

    if (!validation.valid) {
      event.preventDefault();
      showStatus("error", validation.message);
      return;
    }

    setSubmittingState(actionButtons, submitButton, "Enviando...");
  });

  form.querySelectorAll("[data-channel='whatsapp']").forEach((button) => {
    button.addEventListener("click", () => {
      if (!form.reportValidity()) return;

      const cvFile = fileInput && fileInput.files ? fileInput.files[0] : null;
      const validation = validateCvFile(cvFile);
      if (!validation.valid) {
        showStatus("error", validation.message);
        return;
      }

      const lines = collectFormLines(form, { includeFiles: true });
      openWhatsApp(`Hola Valor Humano,\n\n${lines.join("\n")}\n\nContinuo la postulacion por este canal y adjunto mi CV.`);
    });
  });
}

function setupShowcases() {
  const showcases = document.querySelectorAll("[data-showcase]");
  if (!showcases.length) return;

  showcases.forEach((showcase) => {
    const slides = Array.from(showcase.querySelectorAll(".showcase-slide"));
    const dots = Array.from(showcase.querySelectorAll(".showcase-dot"));
    if (slides.length <= 1) return;

    let currentIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
    if (currentIndex < 0) currentIndex = 0;
    let timer = null;

    const setActive = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === currentIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });

      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === currentIndex;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-pressed", String(active));
      });
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => {
        setActive(currentIndex + 1);
      }, 4600);
    };

    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        setActive(index);
        start();
      });
    });

    showcase.addEventListener("mouseenter", stop);
    showcase.addEventListener("mouseleave", start);
    showcase.addEventListener("focusin", stop);
    showcase.addEventListener("focusout", start);

    setActive(currentIndex);
    start();
  });
}

function setupRevealSystem() {
  const candidates = document.querySelectorAll(
    ".hero-shell, .section-header, .service-card, .metal-card, .process-card, .portal-card, .contact-method, .form-card, .contact-rail, .cta-band, .footer-shell"
  );

  if (!candidates.length || !("IntersectionObserver" in window)) {
    candidates.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  candidates.forEach((element) => {
    element.classList.add("reveal-in");
    observer.observe(element);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupReadyState();
setupHeaderState();
toggleNavigation();
setupWhatsAppLinks();
setupContactForms();
setupJobsForm();
setupShowcases();
  setupRevealSystem();
});
