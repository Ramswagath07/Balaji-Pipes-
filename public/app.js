const C = window.SB_CONTENT;
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const translations = {
  en: {
    "nav.home":"Home","nav.about":"About","nav.products":"Products","nav.services":"Services","nav.projects":"Projects","nav.clients":"Clients","nav.testimonials":"Testimonials","nav.contact":"Contact",
    "labels.about":"ABOUT SRI BALAJI","labels.products":"PRODUCTS",
    "hero.title":"YOUR TRUSTED PARTNER FOR <em>PLUMBING, ELECTRICAL,</em> MOTORS & PUMPS",
    "hero.body":"Quality products, trusted brands and practical support for homes, businesses and project requirements.",
    "hero.note":"Serving Rajapalayam and across Virudhunagar District",
    "about.title":"A practical local partner for everyday and project requirements.",
    "about.body":"Sri Balaji Pipes & Electricals is a Rajapalayam-based supplier for plumbing, electrical, motor and pump requirements. Customers can explore materials and accessories for residential, commercial, agricultural and project needs.",
    "about.area":"Serving Rajapalayam and surrounding areas across Virudhunagar District.",
    "products.title":"Find the category you need.",
    "products.search":"Search: pump, wire, fan, pipe...",
    "products.note":"Brands/products available may vary. Contact us for current availability.",
    "why.title":"Built around simple, useful customer support.",
    "services.title":"Support when you need to get the job moving.",
    "cta.call":"Call Now","cta.whatsapp":"WhatsApp Us","cta.directions":"Get Directions","cta.explore":"Explore Products →","cta.request":"Request a Quote","cta.send":"Send Enquiry"
  },
  ta: {
    "nav.home":"முகப்பு","nav.about":"எங்களைப் பற்றி","nav.products":"தயாரிப்புகள்","nav.services":"சேவைகள்","nav.projects":"திட்டங்கள்","nav.clients":"வாடிக்கையாளர்கள்","nav.testimonials":"வாடிக்கையாளர் கருத்துகள்","nav.contact":"தொடர்பு",
    "labels.about":"ஸ்ரீ பாலாஜி பற்றி","labels.products":"தயாரிப்புகள்",
    "hero.title":"பிளம்பிங், எலக்ட்ரிக்கல், <em>மோட்டார் மற்றும் பம்ப்</em> தேவைகளுக்கான உங்கள் நம்பகமான துணை",
    "hero.body":"வீடுகள், வணிக நிறுவனங்கள் மற்றும் திட்டத் தேவைகளுக்கான தரமான தயாரிப்புகள், நம்பகமான பிராண்டுகள் மற்றும் நடைமுறை உதவி.",
    "hero.note":"ராஜபாளையம் மற்றும் விருதுநகர் மாவட்டம் முழுவதும் சேவை",
    "about.title":"தினசரி மற்றும் திட்டத் தேவைகளுக்கு உங்களுடன் இருக்கும் உள்ளூர் வணிகத் துணை.",
    "about.body":"ஸ்ரீ பாலாஜி பைப்ஸ் & எலக்ட்ரிக்கல்ஸ், ராஜபாளையத்தை மையமாகக் கொண்டு பிளம்பிங், எலக்ட்ரிக்கல், மோட்டார் மற்றும் பம்ப் தேவைகளுக்கான தயாரிப்புகள் மற்றும் பொருட்களை வழங்குகிறது. வீடு, வணிகம், விவசாயம் மற்றும் திட்டத் தேவைகளுக்கு தேவையான பொருட்களைப் பற்றி எங்களிடம் கேட்கலாம்.",
    "about.area":"ராஜபாளையம் மற்றும் விருதுநகர் மாவட்டம் முழுவதும் சேவை.",
    "products.title":"உங்களுக்கு தேவையான வகையைத் தேர்ந்தெடுக்கவும்.",
    "products.search":"தேடுங்கள்: பம்ப், வயர், ஃபேன், பைப்...",
    "products.note":"கிடைக்கும் பிராண்டுகள் மற்றும் தயாரிப்புகள் மாறலாம். தற்போதைய இருப்பு மற்றும் விலைக்கு எங்களைத் தொடர்பு கொள்ளுங்கள்.",
    "why.title":"எளிய, பயனுள்ள வாடிக்கையாளர் உதவியை மையமாகக் கொண்டது.",
    "services.title":"வேலை விரைவாக முன்னேற தேவையான உதவி.",
    "cta.call":"இப்போது அழைக்கவும்","cta.whatsapp":"வாட்ஸ்அப்","cta.directions":"வழியைப் பெறுங்கள்","cta.explore":"தயாரிப்புகளைப் பார்க்கவும் →","cta.request":"விலைப்பேறு கேட்கவும்","cta.send":"விசாரணையை அனுப்பவும்"
  }
};

function setLanguage(lang){
  document.documentElement.lang = lang === "ta" ? "ta" : "en";
  localStorage.setItem("sb-language", lang);
  $$(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
  $$("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang][key] !== undefined) el.innerHTML = translations[lang][key];
  });
  $$("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[lang][key] !== undefined) el.placeholder = translations[lang][key];
  });
}

$$(".lang-btn").forEach(btn => btn.addEventListener("click", () => setLanguage(btn.dataset.lang)));
setLanguage(localStorage.getItem("sb-language") || "en");

function renderProducts(query=""){
  const q = query.trim().toLowerCase();
  const grid = $("#productGrid");
  const items = C.products.filter(p => !q || [p.title,p.keywords,...p.items,...(p.brands||[])].join(" ").toLowerCase().includes(q));
  grid.innerHTML = items.length ? items.map(p => `
    <article class="product-card reveal">
      <div class="product-visual pv-${p.key}"><span>${p.icon}</span></div>
      <div class="product-body">
        <div class="product-top"><span class="mini-label">CATEGORY</span><span class="product-arrow">↗</span></div>
        <h3>${p.title}</h3>
        <ul>${p.items.slice(0,5).map(i=>`<li>${i}</li>`).join("")}</ul>
        ${p.brands ? `<div class="brand-tags">${p.brands.map(b=>`<span>${b}</span>`).join("")}</div>` : ""}
        <button class="ask-btn" data-product="${p.title}">Check availability / Ask price</button>
      </div>
    </article>`).join("") : `<div class="no-results"><strong>No matching products found.</strong><span>Try another search or contact us.</span></div>`;
  $$(".ask-btn").forEach(btn => btn.addEventListener("click", () => {
    const product = btn.dataset.product;
    const msg = `Hello Sri Balaji Pipes & Electricals, I am interested in ${product}. Please share availability and price.`;
    window.open(`https://wa.me/919715626864?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }));
  observeReveals();
}
renderProducts();
$("#productSearch").addEventListener("input", e => renderProducts(e.target.value));

$("#brandGrid").innerHTML = Object.entries(C.brands).map(([category, brands]) =>
  `<div class="brand-group"><span>${category}</span><div>${brands.map(b=>`<b>${b}</b>`).join("")}</div></div>`
).join("");

const mapQuery = encodeURIComponent(C.business.address);
["directionsHero","directionsContact","directionsFinal"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.href = C.business.googleMapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
});

const menu = $("#mobile-menu"), toggle = $(".menu-toggle");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  menu.hidden = open;
});
$$(".mobile-menu a").forEach(a => a.addEventListener("click", () => {
  toggle.setAttribute("aria-expanded","false"); menu.hidden = true;
}));

$("#enquiryForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget, status = $("#formStatus");
  if (form.website.value) return;
  const data = Object.fromEntries(new FormData(form).entries());
  if (!data.name.trim() || !/^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(data.phone.trim()) || !data.requirement.trim()) {
    status.textContent = "Please enter a valid name, Indian mobile number and requirement.";
    status.className = "form-status error"; return;
  }
  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true; status.textContent = "Sending your enquiry..."; status.className = "form-status";
  try {
    const response = await fetch("/api/enquiry", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({...data, language:document.documentElement.lang, source:"Website contact form"})});
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed");
    status.textContent = "Enquiry received successfully. We'll contact you shortly.";
    status.className = "form-status success"; form.reset();
  } catch (err) {
    status.textContent = "We couldn't send your enquiry right now. Please call or WhatsApp us directly.";
    status.className = "form-status error";
  } finally { btn.disabled = false; }
});

const observer = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("is-visible"); observer.unobserve(e.target); }
}), {threshold:.08});
function observeReveals(){ $$(".reveal:not(.is-visible)").forEach(el => observer.observe(el)); }
observeReveals();

const schema = {
  "@context":"https://schema.org","@type":"LocalBusiness","name":C.business.name,
  "address":{"@type":"PostalAddress","streetAddress":"666, Tenkasi Rd, Thoppupatti","addressLocality":"Rajapalayam","addressRegion":"Tamil Nadu","postalCode":"626117","addressCountry":"IN"},
  "telephone":"+91 9362709000","areaServed":"Virudhunagar District",
  "sameAs":[C.business.instagram]
};
$("#business-schema").textContent = JSON.stringify(schema);
