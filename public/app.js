(() => {
  "use strict";

  const C = window.BALAJI_CONTENT;
  const translations = {
    en: {
      skip:"Skip to content", navHome:"Home", navProducts:"Products", navAbout:"About", navContact:"Contact", navEnquiry:"Product Enquiry", quote:"Quote",
      eyebrow:"RAJAPALAYAM • VIRUDHUNAGAR DISTRICT", heroTitle:"Pipes, Electricals & Everyday Essentials — All in One Place",
      heroText:"Trusted local supply for plumbing, electrical, lighting, fans, bath fittings, wires, cables, motors and pumps.",
      browseProducts:"Browse Products", whatsapp:"WhatsApp Us", serviceArea:"Serving Rajapalayam & across Virudhunagar District",
      localSupply:"Local Supply", localSupplyText:"Rajapalayam based", wideRange:"Wide Range", wideRangeText:"Plumbing & electrical essentials",
      serviceReach:"Service Reach", serviceReachText:"Across Virudhunagar District", productsEyebrow:"PRODUCT RANGE",
      productsTitle:"Products for Home, Shop & Project Needs", productsText:"Explore our major categories. Contact us for availability, specifications and product enquiries.",
      searchLabel:"Search products", searchPlaceholder:"Search products...", allProducts:"All", noProducts:"No products match your search.",
      aboutEyebrow:"ABOUT SRI BALAJI", aboutTitle:"A local destination for plumbing & electrical requirements",
      aboutText:"Sri Balaji Pipes & Electricals is based in Rajapalayam and serves customers across Virudhunagar District with a broad range of plumbing and electrical products.",
      aboutText2:"For current stock, specifications and project requirements, contact the team directly by phone or WhatsApp.",
      locationTitle:"Store Location", openMaps:"Open in Google Maps →", institutionEyebrow:"BUSINESSES & INSTITUTIONS",
      institutionTitle:"Serving a range of requirements", institutionText:"We support product enquiries from businesses and institutions. Specific customer relationships are not published here unless confirmed.",
      confirmation:"Confirmation pending for specific customer relationships.", enquiryEyebrow:"PRODUCT ENQUIRY", enquiryTitle:"Tell us what you need",
      enquiryText:"Send a product or project requirement. If online enquiry delivery is unavailable, you can contact us directly by phone or WhatsApp.",
      ownerLabel:"Balaji Raja", mdLabel:"Abhinav Raju", nameLabel:"Name", namePlaceholder:"Your name", phoneLabel:"Phone",
      requirementLabel:"Requirement", requirementPlaceholder:"What products do you need?", contactMethodLabel:"Preferred contact", shopLabel:"Shop / Company", shopPlaceholder:"Shop, company or institution",
      locationLabel:"Location", locationPlaceholder:"Town / area", categoryLabel:"Product category", quantityLabel:"Quantity / approximate requirement",
      quantityPlaceholder:"Example: 100 m, 20 nos, 2 HP", uploadLabel:"Upload BOQ / quotation / product photo",
      uploadHelp:"Up to 3 files. PDF, JPG or PNG. Maximum 10 MB each.", uploadNote:"For WhatsApp/SMS, your message is prepared automatically; attach the selected files in WhatsApp if you want to send the documents with the message.",
      catPlumbing:"Plumbing", catElectrical:"Electrical", catLighting:"Lighting", catFans:"Fans", catBath:"Bath Fittings", catSwitches:"Switches & Accessories", catWires:"Wires & Cables", catMotors:"Motors & Pumps", catOther:"Other",
      sendWhatsApp:"WhatsApp Quote", sendSMS:"SMS", smsOption:"SMS", clientEyebrow:"CLIENTS & INSTITUTIONS", clientTitle:"Businesses and institutions we serve",
      clientText:"Selected businesses, shops, schools, clinics and institutions served by Sri Balaji Pipes & Electricals.",
      quotePoint1:"✓ PDF, JPG and PNG uploads", quotePoint2:"✓ Shop / company name included", quotePoint3:"✓ Quantity and project details", quotePoint4:"✓ WhatsApp & SMS sharing",
      whatsappOption:"WhatsApp", phoneOption:"Phone", sendEnquiry:"Send Enquiry", contactEyebrow:"CONTACT", contactTitle:"Talk to Sri Balaji",
      whatsappLabel:"WhatsApp", instagramLabel:"Instagram", footerText:"Plumbing & electrical products in Rajapalayam, serving across Virudhunagar District.",
      footerVisit:"Visit", footerConnect:"Connect", copyright:"© Sri Balaji Pipes & Electricals. All rights reserved.",
      formSending:"Sending...", formSuccess:"Thank you. Your enquiry has been sent.", formUnavailable:"Online enquiry is not configured yet. Please call or WhatsApp us directly.",
      formError:"We couldn't send your enquiry right now. Please call or WhatsApp us directly.", formValidation:"Please enter a valid name, Indian phone number and requirement."
    },
    ta: {
      skip:"உள்ளடக்கத்திற்குச் செல்லவும்", navHome:"முகப்பு", navProducts:"பொருட்கள்", navAbout:"எங்களைப் பற்றி", navContact:"தொடர்பு", navEnquiry:"பொருள் விசாரணை", quote:"விலைப்புள்ளி",
      eyebrow:"ராஜபாளையம் • விருதுநகர் மாவட்டம்", heroTitle:"குழாய்கள், மின்சாதனங்கள் மற்றும் அன்றாட தேவைகள் — ஒரே இடத்தில்",
      heroText:"பிளம்பிங், மின்சாதனங்கள், விளக்குகள், மின்விசிறிகள், குளியலறை பொருத்துதல்கள், கம்பிகள், கேபிள்கள், மோட்டார்கள் மற்றும் பம்புகள் கிடைக்கும்.",
      browseProducts:"பொருட்களைப் பார்க்கவும்", whatsapp:"WhatsApp தொடர்பு", serviceArea:"ராஜபாளையம் மற்றும் விருதுநகர் மாவட்டம் முழுவதும் சேவை",
      localSupply:"உள்ளூர் விநியோகம்", localSupplyText:"ராஜபாளையம்", wideRange:"பரந்த பொருள் வரிசை", wideRangeText:"பிளம்பிங் மற்றும் மின்சாதனங்கள்",
      serviceReach:"சேவை பகுதி", serviceReachText:"விருதுநகர் மாவட்டம் முழுவதும்", productsEyebrow:"பொருள் வரிசை",
      productsTitle:"வீடு, கடை மற்றும் திட்டத் தேவைகளுக்கான பொருட்கள்", productsText:"எங்கள் முக்கிய பொருள் வகைகளைப் பார்க்கவும். இருப்பு, விவரக்குறிப்புகள் மற்றும் விசாரணைகளுக்கு தொடர்பு கொள்ளவும்.",
      searchLabel:"பொருட்களைத் தேடவும்", searchPlaceholder:"பொருட்களைத் தேடவும்...", allProducts:"அனைத்தும்", noProducts:"உங்கள் தேடலுக்கு பொருத்தமான பொருட்கள் இல்லை.",
      aboutEyebrow:"ஸ்ரீ பாலாஜி பற்றி", aboutTitle:"பிளம்பிங் மற்றும் மின்சாதனத் தேவைகளுக்கான உள்ளூர் நிலையம்",
      aboutText:"ஸ்ரீ பாலாஜி பைப்ஸ் & எலக்ட்ரிக்கல்ஸ் ராஜபாளையத்தில் அமைந்துள்ளது. விருதுநகர் மாவட்டம் முழுவதும் பல்வேறு பிளம்பிங் மற்றும் மின்சாதனப் பொருட்களை வழங்குகிறது.",
      aboutText2:"தற்போதைய இருப்பு, விவரக்குறிப்புகள் மற்றும் திட்டத் தேவைகளுக்கு தொலைபேசி அல்லது WhatsApp மூலம் நேரடியாக தொடர்பு கொள்ளவும்.",
      locationTitle:"கடை முகவரி", openMaps:"Google Maps-ல் திறக்கவும் →", institutionEyebrow:"வணிகங்கள் & நிறுவனங்கள்",
      institutionTitle:"பல்வேறு தேவைகளுக்கான சேவை", institutionText:"வணிகங்கள் மற்றும் நிறுவனங்களின் பொருள் விசாரணைகளை நாங்கள் ஏற்கிறோம். உறுதி செய்யப்படாத குறிப்பிட்ட வாடிக்கையாளர் தொடர்புகள் இங்கு வெளியிடப்படவில்லை.",
      confirmation:"குறிப்பிட்ட வாடிக்கையாளர் தொடர்புகளுக்கான உறுதிப்படுத்தல் நிலுவையில் உள்ளது.", enquiryEyebrow:"பொருள் விசாரணை", enquiryTitle:"உங்களுக்கு தேவையானதை தெரிவிக்கவும்",
      enquiryText:"பொருள் அல்லது திட்டத் தேவையை அனுப்பவும். ஆன்லைன் விசாரணை சேவை கிடைக்கவில்லை என்றால் தொலைபேசி அல்லது WhatsApp மூலம் தொடர்பு கொள்ளலாம்.",
      ownerLabel:"பாலாஜி ராஜா", mdLabel:"அபிநவ் ராஜு", nameLabel:"பெயர்", namePlaceholder:"உங்கள் பெயர்", phoneLabel:"தொலைபேசி",
      requirementLabel:"தேவை", requirementPlaceholder:"எந்த பொருட்கள் தேவை?", contactMethodLabel:"விருப்பமான தொடர்பு", shopLabel:"கடை / நிறுவனம்", shopPlaceholder:"கடை, நிறுவனம் அல்லது நிறுவனத்தின் பெயர்",
      locationLabel:"இடம்", locationPlaceholder:"நகரம் / பகுதி", categoryLabel:"பொருள் வகை", quantityLabel:"அளவு / தேவையின் தோராயம்",
      quantityPlaceholder:"உதாரணம்: 100 மீ, 20 எண்ணிக்கை, 2 HP", uploadLabel:"BOQ / விலைப்புள்ளி / பொருள் புகைப்படம் பதிவேற்றவும்",
      uploadHelp:"அதிகபட்சம் 3 கோப்புகள். PDF, JPG அல்லது PNG. ஒவ்வொன்றும் அதிகபட்சம் 10 MB.", uploadNote:"WhatsApp/SMS செய்தி தானாக தயாராகும். ஆவணங்களையும் அனுப்ப வேண்டுமெனில் WhatsApp-ல் தேர்ந்தெடுத்த கோப்புகளை இணைக்கவும்.",
      catPlumbing:"பிளம்பிங்", catElectrical:"மின்சாதனங்கள்", catLighting:"விளக்குகள்", catFans:"மின்விசிறிகள்", catBath:"குளியலறை பொருத்துதல்கள்", catSwitches:"சுவிட்சுகள் மற்றும் உபகரணங்கள்", catWires:"கம்பிகள் மற்றும் கேபிள்கள்", catMotors:"மோட்டார்கள் மற்றும் பம்புகள்", catOther:"மற்றவை",
      sendWhatsApp:"WhatsApp விலைப்புள்ளி", sendSMS:"SMS", smsOption:"SMS", clientEyebrow:"வாடிக்கையாளர்கள் & நிறுவனங்கள்", clientTitle:"நாங்கள் சேவை வழங்கும் நிறுவனங்கள்",
      clientText:"ஸ்ரீ பாலாஜி பைப்ஸ் & எலக்ட்ரிக்கல்ஸ் சேவை வழங்கியுள்ள தேர்ந்தெடுக்கப்பட்ட வணிகங்கள், கடைகள், பள்ளிகள், கிளினிக்குகள் மற்றும் நிறுவனங்கள்.",
      quotePoint1:"✓ PDF, JPG மற்றும் PNG பதிவேற்றம்", quotePoint2:"✓ கடை / நிறுவனப் பெயர் சேர்க்கலாம்", quotePoint3:"✓ அளவு மற்றும் திட்ட விவரங்கள்", quotePoint4:"✓ WhatsApp & SMS பகிர்வு",
      whatsappOption:"WhatsApp", phoneOption:"தொலைபேசி", sendEnquiry:"விசாரணையை அனுப்பவும்", contactEyebrow:"தொடர்பு", contactTitle:"ஸ்ரீ பாலாஜியைத் தொடர்பு கொள்ளுங்கள்",
      whatsappLabel:"WhatsApp", instagramLabel:"Instagram", footerText:"ராஜபாளையத்தில் பிளம்பிங் மற்றும் மின்சாதனப் பொருட்கள்; விருதுநகர் மாவட்டம் முழுவதும் சேவை.",
      footerVisit:"வருகை", footerConnect:"தொடர்பு", copyright:"© ஸ்ரீ பாலாஜி பைப்ஸ் & எலக்ட்ரிக்கல்ஸ். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
      formSending:"அனுப்பப்படுகிறது...", formSuccess:"நன்றி. உங்கள் விசாரணை அனுப்பப்பட்டது.", formUnavailable:"ஆன்லைன் விசாரணை சேவை இன்னும் அமைக்கப்படவில்லை. தொலைபேசி அல்லது WhatsApp மூலம் தொடர்பு கொள்ளவும்.",
      formError:"இப்போது உங்கள் விசாரணையை அனுப்ப முடியவில்லை. தொலைபேசி அல்லது WhatsApp மூலம் தொடர்பு கொள்ளவும்.", formValidation:"சரியான பெயர், இந்திய தொலைபேசி எண் மற்றும் தேவையை உள்ளிடவும்."
    }
  };

  let lang = localStorage.getItem("balaji-language") === "ta" ? "ta" : "en";
  let query = "";

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const t = (key) => translations[lang][key] || translations.en[key] || key;

  function applyTranslations() {
    document.documentElement.lang = lang === "ta" ? "ta" : "en";
    $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    document.title = lang === "ta" ? "ஸ்ரீ பாலாஜி பைப்ஸ் & எலக்ட்ரிக்கல்ஸ் | ராஜபாளையம்" : "Sri Balaji Pipes & Electricals | Rajapalayam";
    const toggle = $("#languageToggle");
    if (toggle) toggle.setAttribute("aria-label", lang === "en" ? "தமிழில் மாற்றவும்" : "Switch to English");
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
      requirement.value = `${link.dataset.product} — `;
      setTimeout(() => requirement.focus(), 50);
    });
  }

  function quoteText() {
    const form = $("#enquiryForm");
    if (!form) return "";
    const d = Object.fromEntries(new FormData(form).entries());
    return [
      "Sri Balaji Pipes & Electricals — Quote Enquiry",
      `Name: ${d.name || "-"}`,
      `Shop/Company: ${d.shopName || "-"}`,
      `Phone: ${d.phone || "-"}`,
      `Location: ${d.location || "-"}`,
      `Category: ${d.category || "-"}`,
      `Quantity: ${d.quantity || "-"}`,
      `Requirement: ${d.requirement || "-"}`,
      `Preferred contact: ${d.contactMethod || "-"}`,
      "Documents: Please attach selected PDF/photo files in WhatsApp if required."
    ].join("\n");
  }

  function setupQuoteSharing() {
    const wa = $("#whatsappQuote");
    const sms = $("#smsQuote");
    if (wa) wa.addEventListener("click", () => {
      const form = $("#enquiryForm");
      if (!form || !form.reportValidity()) return;
      window.open(`https://wa.me/919715626864?text=${encodeURIComponent(quoteText())}`, "_blank", "noopener");
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
