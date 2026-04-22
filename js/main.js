const whatsappNumber = "59898803512";
const defaultFormRecipient = "jhonatan-stemphelet@hotmail.com";
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
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
}

function setupNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".nav-panel");
  const servicesToggle = document.querySelector("[data-services-toggle]");
  const servicesMenu = document.querySelector("[data-services-menu]");

  if (!toggle || !panel) return;

  const closeServicesMenu = () => {
    if (!servicesToggle || !servicesMenu) return;
    servicesToggle.classList.remove("is-active");
    servicesToggle.setAttribute("aria-expanded", "false");
    servicesMenu.classList.remove("is-open");
  };

  const closeNav = () => {
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    closeServicesMenu();
  };

  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (!isOpen) closeServicesMenu();
  });

  if (servicesToggle && servicesMenu) {
    servicesToggle.addEventListener("click", () => {
      if (window.innerWidth <= 1100) return;

      const isOpen = servicesMenu.classList.toggle("is-open");
      servicesToggle.classList.toggle("is-active", isOpen);
      servicesToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = panel.contains(event.target) || toggle.contains(event.target);

    if (window.innerWidth > 1100 && servicesToggle && servicesMenu) {
      const clickedInsideServices = servicesToggle.contains(event.target) || servicesMenu.contains(event.target);
      if (!clickedInsideServices) closeServicesMenu();
    }

    if (!document.body.classList.contains("menu-open")) return;
    if (!clickedInsideNav) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    if (window.innerWidth <= 1100) {
      closeServicesMenu();
    }
  });
}

function normalizeValue(value) {
  if (!value) return "No indicado";
  const normalized = String(value).trim();
  return normalized || "No indicado";
}

function getCurrentPageUrl() {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  return url.toString();
}

function openWhatsApp(message) {
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}

function setupWhatsAppLinks() {
  document.querySelectorAll("[data-wa-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openWhatsApp(link.dataset.waMessage || "Hola Valor Humano, quiero hacer una consulta.");
    });
  });
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
  nextField.value = `${getCurrentPageUrl()}?${key}=ok`;
}

function setSubmittingState(form, label) {
  const buttons = form.querySelectorAll("button");
  const submitButton = form.querySelector('button[type="submit"]');

  buttons.forEach((button) => {
    button.disabled = true;
  });

  if (submitButton) submitButton.textContent = label;
}

function setupContactForms() {
  const forms = document.querySelectorAll("[data-contact-form]");
  if (!forms.length) return;

  const currentUrl = new URL(window.location.href);

  forms.forEach((form) => {
    applyFormEndpoint(form);
    prepareNextField(form, "consulta");

    form.addEventListener("submit", (event) => {
      if (!form.reportValidity()) {
        event.preventDefault();
        return;
      }

      setSubmittingState(form, "Enviando...");
    });
  });

  if (currentUrl.searchParams.get("consulta") === "ok") {
    forms.forEach((form) => {
      const showStatus = bindFormStatus(form);
      showStatus("success", "Tu consulta fue enviada correctamente. En breve seguimos el contacto.");
    });
  }
}

function validateCvFile(file) {
  if (!file) {
    return {
      valid: false,
      message: "Adjunta tu CV para completar la postulación."
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
      message: "El archivo supera el máximo de 10 MB permitido."
    };
  }

  return { valid: true };
}

function collectFormLines(form, { includeFiles = false } = {}) {
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

function setupJobsForm() {
  const form = document.querySelector("[data-jobs-form]");
  if (!form) return;

  applyFormEndpoint(form);
  form.enctype = "multipart/form-data";
  prepareNextField(form, "postulacion");

  const currentUrl = new URL(window.location.href);
  const fileInput = form.querySelector('input[type="file"]');
  const showStatus = bindFormStatus(form, { placement: "before" });

  if (currentUrl.searchParams.get("postulacion") === "ok") {
    showStatus("success", "Tu postulación fue enviada correctamente. Si el llamado sigue activo, continuamos por los datos que dejaste.");
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

  form.addEventListener("submit", (event) => {
    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }

    const selectedFile = fileInput && fileInput.files ? fileInput.files[0] : null;
    const validation = validateCvFile(selectedFile);

    if (!validation.valid) {
      event.preventDefault();
      showStatus("error", validation.message);
      return;
    }

    setSubmittingState(form, "Enviando...");
  });

  form.querySelectorAll('[data-channel="whatsapp"]').forEach((button) => {
    button.addEventListener("click", () => {
      if (!form.reportValidity()) return;

      const selectedFile = fileInput && fileInput.files ? fileInput.files[0] : null;
      const validation = validateCvFile(selectedFile);

      if (!validation.valid) {
        showStatus("error", validation.message);
        return;
      }

      const lines = collectFormLines(form, { includeFiles: true });
      openWhatsApp(`Hola Valor Humano,\n\n${lines.join("\n")}\n\nContinúo la postulación por este canal y adjunto mi CV.`);
    });
  });
}

function setupCarousel() {
  const carousels = document.querySelectorAll("[data-carousel]");
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
    const prevButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");

    if (!track || slides.length <= 1) return;

    let currentIndex = 0;
    let timer = null;

    const render = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, index) => {
        const isActive = index === currentIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-pressed", String(isActive));
      });
    };

    const setIndex = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      render();
    };

    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => {
        setIndex(currentIndex + 1);
      }, 5200);
    };

    prevButton?.addEventListener("click", () => {
      setIndex(currentIndex - 1);
      start();
    });

    nextButton?.addEventListener("click", () => {
      setIndex(currentIndex + 1);
      start();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        setIndex(index);
        start();
      });
    });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);

    render();
    start();
  });
}

function setupRevealSystem() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
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

  items.forEach((item) => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", () => {
  setupReadyState();
  setupHeaderState();
  setupNavigation();
  setupWhatsAppLinks();
  setupContactForms();
  setupJobsForm();
  setupCarousel();
  setupRevealSystem();
});
