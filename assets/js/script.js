(() => {
  "use strict";

  const CONTACT_EMAIL = "rrs.system.technology@gmail.com";
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = [...document.querySelectorAll("main section[id]")];
  const toast = document.getElementById("site-toast");
  let toastTimer;

  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  const closeMenu = () => {
    menuToggle?.classList.remove("is-open");
    mainNav?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menu de navegação");
  };

  const toggleMenu = () => {
    if (!menuToggle || !mainNav) return;

    const willOpen = !mainNav.classList.contains("is-open");
    menuToggle.classList.toggle("is-open", willOpen);
    mainNav.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute(
      "aria-label",
      willOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
    );
  };

  const showToast = (message) => {
    if (!toast) return;
    const text = toast.querySelector("span");
    if (text) text.textContent = message;

    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 5200);
  };

  const normalizeText = (value) => String(value ?? "").trim();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
  };

  const setFieldError = (field, message = "") => {
    const wrapper = field?.closest(".field-group");
    const error = wrapper?.querySelector(".field-error");
    wrapper?.classList.toggle("has-error", Boolean(message));
    if (error) error.textContent = message;
    field?.setAttribute("aria-invalid", String(Boolean(message)));
  };

  const clearFormErrors = (form) => {
    form.querySelectorAll(".field-group").forEach((group) => {
      group.classList.remove("has-error");
      const error = group.querySelector(".field-error");
      if (error) error.textContent = "";
    });

    form.querySelectorAll("[aria-invalid]").forEach((field) => {
      field.setAttribute("aria-invalid", "false");
    });

    const consentError = form.querySelector(".consent-error");
    if (consentError) consentError.textContent = "";
  };

  const validateForm = (form) => {
    clearFormErrors(form);

    const nome = form.elements.namedItem("nome");
    const email = form.elements.namedItem("email");
    const interesse = form.elements.namedItem("interesse");
    const mensagem = form.elements.namedItem("mensagem");
    const consentimento = form.elements.namedItem("consentimento");
    let firstInvalid = null;

    const invalidate = (field, message) => {
      setFieldError(field, message);
      firstInvalid ??= field;
    };

    if (normalizeText(nome?.value).length < 3) {
      invalidate(nome, "Informe seu nome completo.");
    }

    if (!validateEmail(normalizeText(email?.value))) {
      invalidate(email, "Informe um e-mail válido.");
    }

    if (!normalizeText(interesse?.value)) {
      invalidate(interesse, "Selecione uma solução de interesse.");
    }

    if (normalizeText(mensagem?.value).length < 12) {
      invalidate(mensagem, "Descreva sua necessidade com um pouco mais de detalhe.");
    }

    if (!consentimento?.checked) {
      const consentError = form.querySelector(".consent-error");
      if (consentError) {
        consentError.textContent = "Confirme a leitura da Política de Privacidade.";
      }
      firstInvalid ??= consentimento;
    }

    if (firstInvalid) {
      firstInvalid.focus({ preventScroll: true });
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }

    return true;
  };

  const getFormPayload = (form) => {
    const data = new FormData(form);
    return {
      nome: normalizeText(data.get("nome")),
      empresa: normalizeText(data.get("empresa")) || "Não informada",
      email: normalizeText(data.get("email")),
      telefone: normalizeText(data.get("telefone")) || "Não informado",
      interesse: normalizeText(data.get("interesse")),
      mensagem: normalizeText(data.get("mensagem"))
    };
  };

  const buildMailto = (payload) => {
    const subject = `Solicitação comercial - ${payload.interesse} - ${payload.nome}`;
    const body = [
      "Olá, equipe RRS System Technology!",
      "",
      "Gostaria de receber mais informações.",
      "",
      `Nome: ${payload.nome}`,
      `Empresa: ${payload.empresa}`,
      `E-mail: ${payload.email}`,
      `Telefone: ${payload.telefone}`,
      `Interesse: ${payload.interesse}`,
      "",
      "Necessidade:",
      payload.mensagem,
      "",
      "Mensagem enviada pelo site institucional."
    ].join("\n");

    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const submitViaFormspree = async (endpoint, payload) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome: payload.nome,
        empresa: payload.empresa,
        email: payload.email,
        telefone: payload.telefone,
        interesse: payload.interesse,
        mensagem: payload.mensagem,
        _replyto: payload.email,
        _subject: `Solicitação comercial - ${payload.interesse} - ${payload.nome}`
      })
    });

    if (!response.ok) {
      throw new Error("Falha no envio pelo Formspree.");
    }
  };

  const setupForm = () => {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const helper = document.getElementById("form-helper");
    const endpoint = normalizeText(form.getAttribute("data-formspree-endpoint"));

    if (helper) {
      helper.textContent = endpoint
        ? "Sua solicitação será enviada diretamente para a equipe comercial."
        : "O envio abrirá seu aplicativo de e-mail com a mensagem preenchida.";
    }

    const phone = form.elements.namedItem("telefone");
    phone?.addEventListener("input", (event) => {
      const input = event.currentTarget;
      const digits = input.value.replace(/\D/g, "").slice(0, 11);
      let formatted = digits;

      if (digits.length > 2) {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      }
      if (digits.length > 7) {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      }

      input.value = formatted;
    });

    form.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        if (field.name === "consentimento") {
          const consentError = form.querySelector(".consent-error");
          if (consentError && field.checked) consentError.textContent = "";
          return;
        }
        setFieldError(field, "");
      });

      field.addEventListener("change", () => {
        if (field.name === "consentimento") {
          const consentError = form.querySelector(".consent-error");
          if (consentError && field.checked) consentError.textContent = "";
        } else {
          setFieldError(field, "");
        }
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!validateForm(form)) return;

      const submitButton = form.querySelector(".submit-button");
      const label = submitButton?.querySelector("span");
      const originalLabel = label?.textContent ?? "Enviar solicitação";
      const payload = getFormPayload(form);

      submitButton?.classList.add("is-loading");

      try {
        if (endpoint) {
          if (label) label.textContent = "Enviando...";
          await submitViaFormspree(endpoint, payload);
          form.reset();
          clearFormErrors(form);
          showToast("Solicitação enviada com sucesso. Em breve retornaremos o contato.");
        } else {
          if (label) label.textContent = "Preparando mensagem...";
          showToast("Mensagem preparada. Finalize o envio no seu aplicativo de e-mail.");
          window.setTimeout(() => {
            window.location.href = buildMailto(payload);
          }, 250);
        }
      } catch (error) {
        console.error(error);
        showToast("Não foi possível enviar agora. Tentando abrir seu e-mail...");
        window.setTimeout(() => {
          window.location.href = buildMailto(payload);
        }, 400);
      } finally {
        submitButton?.classList.remove("is-loading");
        if (label) label.textContent = originalLabel;
      }
    });
  };

  const setupCopyEmail = () => {
    const button = document.getElementById("copy-email");
    if (!button) return;

    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        showToast("E-mail comercial copiado.");
      } catch {
        showToast(CONTACT_EMAIL);
      }
    });
  };

  const setupProductLinks = () => {
    document.querySelectorAll("[data-product]").forEach((link) => {
      link.addEventListener("click", () => {
        const product = link.getAttribute("data-product");
        const select = document.getElementById("interesse");
        if (!select || !product) return;

        const option = [...select.options].find((item) => item.value === product);
        if (option) select.value = product;
      });
    });
  };

  const setupImageFallbacks = () => {
    document.querySelectorAll(".image-fallback img").forEach((image) => {
      const markMissing = () => {
        image.closest(".image-fallback")?.classList.add("is-missing");
        image.hidden = true;
      };

      image.addEventListener("error", markMissing, { once: true });
      if (image.complete && image.naturalWidth === 0) markMissing();
    });

    document.querySelectorAll(".brand-logo-shell img").forEach((image) => {
      const markLogoMissing = () => {
        image.closest(".brand-logo-shell")?.classList.add("is-missing");
      };
      image.addEventListener("error", markLogoMissing, { once: true });
      if (image.complete && image.naturalWidth === 0) markLogoMissing();
    });
  };

  const setupReveal = () => {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!revealItems.length) return;

    revealItems.forEach((item) => {
      const delay = Number(item.getAttribute("data-reveal-delay") || 0);
      item.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );

    revealItems.forEach((item) => observer.observe(item));
  };

  const setupActiveNavigation = () => {
    if (!("IntersectionObserver" in window) || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const id = visible.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      },
      { rootMargin: "-25% 0px -55%", threshold: [0.08, 0.2, 0.45] }
    );

    sections.forEach((section) => observer.observe(section));
  };

  const setupBackToTop = () => {
    document.querySelectorAll("[data-back-to-top]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (history.replaceState) {
          history.replaceState(null, "", "#inicio");
        } else {
          window.location.hash = "inicio";
        }
      });
    });
  };

  menuToggle?.addEventListener("click", toggleMenu);
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (event) => {
    if (!mainNav?.classList.contains("is-open")) return;
    if (mainNav.contains(event.target) || menuToggle?.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeMenu();
  });

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  setupReveal();
  setupActiveNavigation();
  setupProductLinks();
  setupImageFallbacks();
  setupCopyEmail();
  setupForm();
  setupBackToTop();
})();
