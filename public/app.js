const C = window.CONTENT || {};

const translations = C.translations || {};

const state = {
  language:
    localStorage.getItem("balaji-language") ||
    "en"
};

const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

function currentLanguage() {
  return state.language === "ta"
    ? "ta"
    : "en";
}

function t(key, fallback = "") {
  const lang = currentLanguage();

  return (
    translations?.[lang]?.[key] ??
    translations?.en?.[key] ??
    fallback
  );
}

// -----------------------------------------------------------------------------
// Language
// -----------------------------------------------------------------------------

function updateLanguage() {
  const lang = currentLanguage();

  document.documentElement.lang =
    lang === "ta" ? "ta" : "en";

  $$("[data-i18n]").forEach((element) => {
    const key =
      element.dataset.i18n;

    const value = t(
      key,
      element.textContent
    );

    if (value) {
      element.textContent = value;
    }
  });

  $$("[data-i18n-placeholder]").forEach(
    (element) => {
      const key =
        element.dataset
          .i18nPlaceholder;

      const value = t(
        key,
        element.getAttribute(
          "placeholder"
        ) || ""
      );

      element.setAttribute(
        "placeholder",
        value
      );
    }
  );

  $$("[data-lang]").forEach(
    (button) => {
      button.classList.toggle(
        "active",
        button.dataset.lang === lang
      );

      button.setAttribute(
        "aria-pressed",
        button.dataset.lang === lang
          ? "true"
          : "false"
      );
    }
  );

  localStorage.setItem(
    "balaji-language",
    lang
  );
}

function setupLanguage() {
  $$("[data-lang]").forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          state.language =
            button.dataset.lang === "ta"
              ? "ta"
              : "en";

          updateLanguage();
        }
      );
    }
  );

  updateLanguage();
}

// -----------------------------------------------------------------------------
// Navigation
// -----------------------------------------------------------------------------

function setupNavigation() {
  const menuButton =
    $("#menuButton");

  const nav =
    $("#mainNav");

  if (
    !menuButton ||
    !nav
  ) {
    return;
  }

  menuButton.addEventListener(
    "click",
    () => {
      const open =
        nav.classList.toggle(
          "open"
        );

      menuButton.setAttribute(
        "aria-expanded",
        open ? "true" : "false"
      );
    }
  );

  $$("a", nav).forEach(
    (link) => {
      link.addEventListener(
        "click",
        () => {
          nav.classList.remove(
            "open"
          );

          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      );
    }
  );
}

// -----------------------------------------------------------------------------
// Product rendering
// -----------------------------------------------------------------------------

function setupProducts() {
  const productGrid =
    $("#productGrid");

  if (
    !productGrid ||
    !Array.isArray(
      C.products
    )
  ) {
    return;
  }

  productGrid.innerHTML =
    C.products
      .map((product) => {
        const name =
          currentLanguage() === "ta"
            ? product.nameTa ||
              product.name
            : product.name;

        return `
          <article class="product-card">
            ${
              product.image
                ? `
                  <img
                    src="${product.image}"
                    alt="${name}"
                    loading="lazy"
                  >
                `
                : ""
            }

            <div class="product-card-content">
              <h3>${name}</h3>

              ${
                product.description
                  ? `
                    <p>
                      ${product.description}
                    </p>
                  `
                  : ""
              }
            </div>
          </article>
        `;
      })
      .join("");
}

// -----------------------------------------------------------------------------
// Contact links
// -----------------------------------------------------------------------------

function setupContactLinks() {
  $$("[data-whatsapp]").forEach(
    (element) => {
      element.addEventListener(
        "click",
        () => {
          const number =
            element.dataset.whatsapp ||
            "919715626864";

          window.open(
            `https://wa.me/${number}`,
            "_blank",
            "noopener,noreferrer"
          );
        }
      );
    }
  );
}

// -----------------------------------------------------------------------------
// Quote form helpers
// -----------------------------------------------------------------------------

function setFormStatus(message) {
  const status =
    $("#formStatus");

  if (status) {
    status.textContent =
      message || "";
  }
}

function getQuoteForm() {
  return $("#quoteForm");
}

function validateQuoteForm(form) {
  const name =
    form.elements.name;

  const phone =
    form.elements.phone;

  const requirement =
    form.elements.requirement;

  if (
    !name ||
    !String(name.value || "").trim()
  ) {
    name?.focus();

    setFormStatus(
      "Please enter your name."
    );

    return false;
  }

  if (
    !phone ||
    !String(phone.value || "").trim()
  ) {
    phone?.focus();

    setFormStatus(
      "Please enter your phone number."
    );

    return false;
  }

  const cleanPhone =
    String(phone.value || "")
      .replace(/[()]/g, "")
      .trim();

  const validIndianPhone =
    /^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(
      cleanPhone
    );

  if (!validIndianPhone) {
    phone.focus();

    setFormStatus(
      "Please enter a valid Indian mobile number."
    );

    return false;
  }

  if (
    !requirement ||
    !String(
      requirement.value || ""
    ).trim()
  ) {
    requirement?.focus();

    setFormStatus(
      "Please enter your requirement."
    );

    return false;
  }

  return true;
}

function validateQuoteFiles(files) {
  if (files.length > 3) {
    setFormStatus(
      "You can upload a maximum of 3 files."
    );

    return false;
  }

  for (const file of files) {
    const allowed =
      [
        "application/pdf",
        "image/jpeg",
        "image/png"
      ].includes(file.type) ||
      /\.(pdf|jpe?g|png)$/i.test(
        file.name
      );

    if (!allowed) {
      setFormStatus(
        `Unsupported file: ${file.name}. Please use PDF, JPG or PNG.`
      );

      return false;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setFormStatus(
        `${file.name} is larger than 10 MB.`
      );

      return false;
    }
  }

  return true;
}

// -----------------------------------------------------------------------------
// Normal enquiry form
// -----------------------------------------------------------------------------

function setupQuoteForm() {
  const form =
    getQuoteForm();

  if (!form) {
    return;
  }

  form.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      if (
        !validateQuoteForm(form)
      ) {
        return;
      }

      const filesInput =
        form.elements.files;

      const files =
        filesInput?.files
          ? Array.from(
              filesInput.files
            )
          : [];

      if (
        !validateQuoteFiles(files)
      ) {
        return;
      }

      const submitButton =
        form.querySelector(
          'button[type="submit"]'
        );

      const originalText =
        submitButton?.textContent ||
        "Send Enquiry";

      if (submitButton) {
        submitButton.disabled =
          true;

        submitButton.textContent =
          "Sending...";
      }

      setFormStatus(
        "Sending your enquiry..."
      );

      try {
        const formData =
          new FormData(form);

        if (
          !formData.has(
            "source"
          )
        ) {
          formData.set(
            "source",
            "Website"
          );
        }

        const response =
          await fetch(
            "/api/enquiry",
            {
              method: "POST",
              body: formData
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.ok
        ) {
          throw new Error(
            result.message ||
              "Could not send your enquiry."
          );
        }

        setFormStatus(
          result.message ||
            "Your enquiry has been sent successfully."
        );

        if (filesInput) {
          filesInput.value = "";
        }
      } catch (error) {
        console.error(
          "Enquiry error:",
          error
        );

        setFormStatus(
          error.message ||
            "Could not send your enquiry. Please try again."
        );
      } finally {
        if (submitButton) {
          submitButton.disabled =
            false;

          submitButton.textContent =
            originalText;
        }
      }
    }
  );
}

// -----------------------------------------------------------------------------
// WhatsApp Cloud API quote sharing
// -----------------------------------------------------------------------------

async function setupQuoteSharing() {
  const wa =
    $("#whatsappQuote");

  if (!wa) {
    return;
  }

  wa.addEventListener(
    "click",
    async () => {
      const form =
        getQuoteForm();

      if (!form) {
        return;
      }

      // ---------------------------------------------------------------
      // Validate form
      // ---------------------------------------------------------------

      if (
        !validateQuoteForm(form)
      ) {
        return;
      }

      // ---------------------------------------------------------------
      // Validate selected files
      // ---------------------------------------------------------------

      const filesInput =
        form.elements.files;

      const selectedFiles =
        filesInput?.files
          ? Array.from(
              filesInput.files
            )
          : [];

      if (
        !validateQuoteFiles(
          selectedFiles
        )
      ) {
        return;
      }

      // ---------------------------------------------------------------
      // Disable button while sending
      // ---------------------------------------------------------------

      const originalText =
        wa.textContent;

      wa.disabled = true;

      wa.textContent =
        "Sending...";

      setFormStatus(
        "Sending quote and files to WhatsApp..."
      );

      try {
        // -------------------------------------------------------------
        // Build multipart form data.
        //
        // IMPORTANT:
        // Do not manually add the files here. FormData(form)
        // already includes the selected files from the file input.
        // -------------------------------------------------------------

        const formData =
          new FormData(form);

        // Tell server.js to use WhatsApp Cloud API.
        formData.set(
          "source",
          "Website Quote WhatsApp"
        );

        // Keep language information accurate.
        formData.set(
          "language",
          currentLanguage() === "ta"
            ? "Tamil"
            : "English"
        );

        // -------------------------------------------------------------
        // Send to our own backend.
        //
        // The access token NEVER reaches the browser.
        // Railway/server.js handles Meta authentication.
        // -------------------------------------------------------------

        const response =
          await fetch(
            "/api/enquiry",
            {
              method: "POST",
              body: formData
            }
          );

        let result;

        try {
          result =
            await response.json();
        } catch {
          throw new Error(
            "The server returned an invalid response."
          );
        }

        if (
          !response.ok ||
          !result.ok
        ) {
          throw new Error(
            result.message ||
              "WhatsApp could not send the quote."
          );
        }

        // -------------------------------------------------------------
        // Success
        // -------------------------------------------------------------

        setFormStatus(
          result.message ||
            "Quote and files sent successfully to WhatsApp."
        );

        // Clear selected files only after success.
        if (filesInput) {
          filesInput.value = "";
        }
      } catch (error) {
        console.error(
          "WhatsApp quote error:",
          error
        );

        setFormStatus(
          error.message ||
            "Could not send the quote to WhatsApp. Please try again."
        );
      } finally {
        wa.disabled = false;

        wa.textContent =
          originalText;
      }
    }
  );
}

// -----------------------------------------------------------------------------
// File input feedback
// -----------------------------------------------------------------------------

function setupFileInput() {
  const input =
    document.querySelector(
      'input[type="file"]'
    );

  if (!input) {
    return;
  }

  input.addEventListener(
    "change",
    () => {
      const files =
        Array.from(
          input.files || []
        );

      if (
        !validateQuoteFiles(
          files
        )
      ) {
        input.value = "";
      }
    }
  );
}

// -----------------------------------------------------------------------------
// Smooth scrolling
// -----------------------------------------------------------------------------

function setupSmoothScroll() {
  $$(
    'a[href^="#"]'
  ).forEach((link) => {
    link.addEventListener(
      "click",
      (event) => {
        const href =
          link.getAttribute(
            "href"
          );

        if (
          !href ||
          href === "#"
        ) {
          return;
        }

        const target =
          document.querySelector(
            href
          );

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    );
  });
}

// -----------------------------------------------------------------------------
// Initialization
// -----------------------------------------------------------------------------

document.addEventListener(
  "DOMContentLoaded",
  async () => {
    setupLanguage();
    setupNavigation();
    setupContactLinks();
    setupQuoteForm();
    await setupQuoteSharing();
    setupFileInput();
    setupSmoothScroll();
  }
);