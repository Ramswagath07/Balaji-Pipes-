import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 3, fileSize: 10 * 1024 * 1024, fields: 12, fieldSize: 32 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = new Set(["application/pdf", "image/jpeg", "image/png"]);
    cb(null, allowed.has(file.mimetype));
  }
});

function validPhone(phone) {
  return /^(?:\x2B91[\s-]?)?[6-9]\d{9}$/.test(String(phone || "").replace(/[()]/g, "").trim());
}
function clean(value, max = 2000) {
  return String(value ?? "").trim().replace(/[<>]/g, "").slice(0, max);
}
function configuredMail() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.MAIL_FROM);
}

app.post("/api/enquiry", enquiryLimiter, (req, res, next) => {
  upload.array("files", 3)(req, res, async (err) => {
    if (err) return res.status(400).json({ ok: false, message: "Please use PDF, JPG or PNG files up to 10 MB each, with a maximum of 3 files." });
    const { name, phone, requirement, contactMethod, language, source, shopName, location, category, quantity } = req.body || {};
    if (!clean(name, 100) || !validPhone(phone) || !clean(requirement, 3000)) {
      return res.status(400).json({ ok: false, message: "Please enter a valid name, Indian phone number and requirement." });
    }

    const payload = {
      name: clean(name, 100), shopName: clean(shopName, 150), phone: clean(phone, 30),
      location: clean(location, 150), category: clean(category, 80), quantity: clean(quantity, 200),
      requirement: clean(requirement, 3000), contactMethod: clean(contactMethod, 30) || "Not specified",
      language: language === "ta" ? "Tamil" : "English", source: clean(source, 120) || "Website",
      timestamp: new Date().toISOString()
    };

    if (!configuredMail()) {
      return res.status(503).json({
        ok: false, configured: false,
        message: "Online enquiry service is not configured yet. Please use WhatsApp or SMS to send the enquiry directly."
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });

      const attachments = (req.files || []).map(file => ({
        filename: file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120),
        content: file.buffer,
        contentType: file.mimetype
      }));

      await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `New website quote enquiry â€” ${payload.name}`,
        text: `Sri Balaji Pipes & Electricals â€” Website Quote Enquiry

Name: ${payload.name}
Shop/Company: ${payload.shopName || "Not specified"}
Phone: ${payload.phone}
Location: ${payload.location || "Not specified"}
Category: ${payload.category || "Not specified"}
Quantity: ${payload.quantity || "Not specified"}
Requirement: ${payload.requirement}
Preferred contact: ${payload.contactMethod}
Language: ${payload.language}
Source: ${payload.source}
Time: ${payload.timestamp}
Attachments: ${attachments.length}`,
        attachments
      });
      return res.json({ ok: true });
    } catch (error) {
      console.error("Enquiry delivery failed:", error);
      return res.status(500).json({ ok: false, configured: true, message: "We couldn't send your enquiry right now. Please use WhatsApp or call us directly." });
    }
  });
});

app.use(express.static(path.join(__dirname, "public"), { extensions: ["html"] }));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, () => console.log(`Sri Balaji website running on http://localhost:${PORT}`));

