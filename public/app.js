(() => {
  "use strict";

  const C = window.BALAJI_CONTENT;
  const translations = C.translations;

  let lang = localStorage.getItem("balaji-language") === "ta" ? "ta" : "en";
  let query = "";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const t = (key) => translations[lang][key] || translations.en[key] || key;

  function applyTranslations() {
    document.documentElement.lang = lang === "ta" ? "ta" : "en";
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.title = lang === "ta" ? "à®¸à¯à®°à¯€ à®ªà®¾à®²à®¾à®œà®¿ à®ªà¯ˆà®ªà¯à®¸à¯ & à®Žà®²à®•à¯à®Ÿà¯à®°à®¿à®•à¯à®•à®²à¯à®¸à¯ | à®°à®¾à®œà®ªà®¾à®³à¯ˆà®¯à®®à¯" : "Sri Balaji Pipes & Electricals | Rajapalayam";
    const toggle = $("#languageToggle");
    if (toggle) toggle.setAttribute("aria-label", lang === "en" ? "à®¤à®®à®¿à®´à®¿à®²à¯ à®®à®¾à®±à¯à®±à®µà¯à®®à¯" : "Switch to English");
    renderProducts();
    renderClients();
  }

  function renderProducts() {
    const grid = $("#productGrid");
    const empty = $("#emptyState");
    if (!grid) return;
    const q = query.trim().toLowerCase();
    const items = C.products.filter(p => {
      const haystack = [p.name, p.ta, p.description].join(" ").toLowerCase();
      return !q || haystack.includes(q);
    });
    grid.innerHTML = items.map(p => `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${p.image}" alt="${lang === "ta" ? p.ta : p.name}" loading="lazy">
        </div>
        <div class="product-body">
          <h3>${lang === "ta" ? p.ta : p.name}</h3>
          <p>${p.description}</p>
          <a class="card-link" href="#enquiry" data-product="${p.name}">${lang === "ta" ? "விசாரிக்கவும் →" : "Enquire →"}</a>
        </div>
      </article>
    `).join("");
    if (empty) empty.hidden = items.length !== 0;
    const count = $("#resultCount");
    if (count) count.textContent = `${items.length} ${lang === "ta" ? "வகைகள்" : "categories"}`;
  }

  function renderClients() {
    const grid = $("#clientGrid");
    if (!grid) return;
    grid.innerHTML = C.clients.map(name => `<span class="client-pill">${name}</span>`).join("");
  }

  function setupNavigation() {
    const button = $("#menuButton");
    const menu = $("#mobileMenu");
    if (!button || !menu) return;
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("open", !open);
    });
    $$("#mobileMenu a").forEach(a => a.addEventListener("click", () => {
      button.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
    }));
  }

  function setupSearch() {
    const input = $("#productSearch");
    if (!input) return;
    input.addEventListener("input", e => { query = e.target.value; renderProducts(); });
  }

  function setupLanguage() {
    const button = $("#languageToggle");
    if (!button) return;
    button.addEventListener("click", () => {
      lang = lang === "en" ? "ta" : "en";
      localStorage.setItem("balaji-language", lang);
      applyTranslations();
    });
  }

  function setupProductEnquiries() {
    document.addEventListener("click", e => {
      const link = e.target.closest("[data-product]");
      if (!link) return;
      const form = $("#enquiryForm");
      if (!form) return;
      const requirement = form.elements.requirement;
      requirement.value = `${link.dataset.product} â€” `;
      setTimeout(() => requirement.focus(), 50);
    });
  }

  function quoteText(fileLinks = []) {
    const form = $("#enquiryForm");
    if (!form) return "";
    const d = Object.fromEntries(new FormData(form).entries());
    const lines = [
      "Sri Balaji Pipes & Electricals â€” Quote Enquiry",
      `Name: ${d.name || "-"}`,
      `Shop/Company: ${d.shopName || "-"}`,
      `Phone: ${d.phone || "-"}`,
      `Location: ${d.location || "-"}`,
      `Category: ${d.category || "-"}`,
      `Quantity: ${d.quantity || "-"}`,
      `Requirement: ${d.requirement || "-"}`,
      `Preferred contact: ${d.contactMethod || "-"}`
    ];
    if (fileLinks.length) {
      lines.push("Documents:");
      fileLinks.forEach(file => lines.push(`${file.name}: ${new URL(file.url, window.location.origin).href}`));
      lines.push("Document links are available for download.");
    } else {
      lines.push("Documents: None attached");
    }
    return lines.join("\n");
  }

  async function prepareWhatsAppFiles() {
    const form = $("#enquiryForm");
    const files = $("#quoteFiles")?.files || [];
    const data = new FormData(form);
    data.append("language", lang);
    data.append("source", "Website Quote WhatsApp");
    data.append("share", "whatsapp");
    const response = await fetch("/api/enquiry?share=whatsapp", { method: "POST", body: data });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) throw new Error(result.message || "Upload failed");
    return Array.isArray(result.files) ? result.files : [];
  }

  function setupQuoteSharing() {
    const wa = $("#whatsappQuote");
    const sms = $("#smsQuote");
    if (wa) wa.addEventListener("click", async () => {
      const form = $("#enquiryForm");
      const status = $("#formStatus");
      if (!form || !form.reportValidity()) return;
      const files = $("#quoteFiles")?.files || [];
      if (files.length > 3 || Array.from(files).some(f => f.size > 10 * 1024 * 1024)) {
        if (status) {
          status.textContent = t("uploadHelp");
          status.className = "form-status error";
        }
        return;
      }
      const button = wa;
      button.disabled = true;
      if (status) {
        status.textContent = files.length ? t("formSending") : "";
        status.className = "form-status";
      }
      try {
        const fileLinks = files.length ? await prepareWhatsAppFiles() : [];
        const text = quoteText(fileLinks);
        window.open(`https://wa.me/919715626864?text=${encodeURIComponent(text)}`, "_blank", "noopener");
        if (status) {
          status.textContent = t("formSuccess");
          status.className = "form-status success";
        }
      } catch (error) {
        if (status) {
          status.textContent = error.message || t("formError");
          status.className = "form-status error";
        }
      } finally {
        button.disabled = false;
      }
    });
    if (sms) sms.addEventListener("click", () => {
      const form = $("#enquiryForm");
      if (!form || !form.reportValidity()) return;
      window.location.href = `sms:+919715626864?body=${encodeURIComponent(quoteText())}`;
    });
  }

  function setupForm() {
    const form = $("#enquiryForm");
    const status = $("#formStatus");
    if (!form || !status) return;
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const data = new FormData(form);
      const phone = String(data.get("phone") || "").replace(/[()\s-]/g, "");
      if (!String(data.get("name") || "").trim() || !/^(?:\+91)?[6-9]\d{9}$/.test(phone) || !String(data.get("requirement") || "").trim()) {
        status.textContent = t("formValidation");
        status.className = "form-status error";
        return;
      }
      const files = $("#quoteFiles")?.files || [];
      if (files.length > 3 || Array.from(files).some(f => f.size > 10 * 1024 * 1024)) {
        status.textContent = t("uploadHelp");
        status.className = "form-status error";
        return;
      }
      data.append("language", lang);
      data.append("source", "Website Quote Form");
      status.textContent = t("formSending");
      status.className = "form-status";
      const button = form.querySelector("button[type=submit]");
      button.disabled = true;
      try {
        const response = await fetch("/api/enquiry", { method: "POST", body: data });
        const result = await response.json().catch(() => ({}));
        if (response.ok && result.ok) {
          status.textContent = t("formSuccess");
          status.className = "form-status success";
          form.reset();
        } else if (response.status === 503 || result.configured === false) {
          status.textContent = t("formUnavailable");
          status.className = "form-status error";
        } else {
          status.textContent = result.message || t("formError");
          status.className = "form-status error";
        }
      } catch {
        status.textContent = t("formError");
        status.className = "form-status error";
      } finally {
        button.disabled = false;
      }
    });
  }

  function setupSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": C.business.name,
      "image": "/images/logo-original.jpg",
      "url": window.location.origin,
      "telephone": C.business.phoneOwner,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "666, Tenkasi Rd, Thoppupatti",
        "addressLocality": "Rajapalayam",
        "addressRegion": "Tamil Nadu",
        "postalCode": "626117",
        "addressCountry": "IN"
      },
      "areaServed": "Virudhunagar District, Tamil Nadu, India",
      "sameAs": [C.business.instagram, C.business.whatsapp]
    };
    $("#business-schema").textContent = JSON.stringify(schema);
  }

  setupNavigation();
  setupSearch();
  setupLanguage();
  setupProductEnquiries();
  setupForm();
  setupQuoteSharing();
  setupSchema();
  applyTranslations();
})();


/* Native PDF file sharing */
(function setupDirectPdfShare() {
  function install() {
    const wa = document.querySelector("#whatsappQuote");
    const fileInput = document.querySelector("#quoteFiles");

    if (!wa || !fileInput) {
      console.warn("Direct PDF sharing: quote controls not found.");
      return;
    }

    if (document.querySelector("#directPdfShare")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.id = "directPdfShare";
    button.className = wa.className;
    button.textContent = "📎 Share PDF Directly";
    button.title = "Share the selected PDF as an actual file";

    wa.insertAdjacentElement("afterend", button);

    button.addEventListener("click", async () => {
      const files = Array.from(fileInput.files || []);

      if (!files.length) {
        alert("Please select a PDF or document first.");
        fileInput.click();
        return;
      }

      const shareFiles = files.filter(file =>
        /^(application\/pdf|image\/(jpeg|jpg|png))$/i.test(file.type)
      );

      if (!shareFiles.length) {
        alert("Please select a PDF, JPG, JPEG, or PNG file.");
        return;
      }

      const shareData = {
        title: "Sri Balaji Pipes & Electricals — Quote",
        text: "Quote enquiry from Sri Balaji Pipes & Electricals.",
        files: shareFiles
      };

      try {
        if (
          !navigator.share ||
          !navigator.canShare ||
          !navigator.canShare({ files: shareFiles })
        ) {
          alert(
            "Direct file sharing is not supported by this browser. " +
            "Please use WhatsApp Quote or download the PDF instead."
          );
          return;
        }

        await navigator.share(shareData);
      } catch (error) {
        if (error && error.name === "AbortError") {
          return;
        }

        console.error("Direct PDF sharing failed:", error);
        alert("The file could not be shared. Please try again.");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install);
  } else {
    install();
  }
})();
