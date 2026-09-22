import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

function validPhone(phone) {
  return /^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(String(phone || "").replace(/[()]/g, "").trim());
}

function clean(value, max = 2000) {
  return String(value ?? "").trim().replace(/[<>]/g, "").slice(0, max);
}

app.post("/api/enquiry", enquiryLimiter, async (req, res) => {
  const { name, phone, requirement, contactMethod, language, source } = req.body || {};

  if (!clean(name, 100) || !validPhone(phone) || !clean(requirement, 2000)) {
    return res.status(400).json({
      ok: false,
      message: "Please enter a valid name, Indian phone number and requirement."
    });
  }

  const payload = {
    name: clean(name, 100),
    phone: clean(phone, 30),
    requirement: clean(requirement, 2000),
    contactMethod: clean(contactMethod, 30) || "Not specified",
    language: language === "ta" ? "Tamil" : "English",
    source: clean(source, 120) || "Website",
    timestamp: new Date().toISOString()
  };

  const configured =
    process.env.ADMIN_EMAIL &&
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.MAIL_FROM;

  if (!configured) {
    return res.status(503).json({
      ok: false,
      configured: false,
      message: "Online enquiry service is not configured yet. Please call or WhatsApp us directly."
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      replyTo: payload.phone.includes("@") ? undefined : undefined,
      subject: `New website enquiry — ${payload.name}`,
      text:
`Sri Balaji Pipes & Electricals — Website Enquiry

Name: ${payload.name}
Phone: ${payload.phone}
Requirement: ${payload.requirement}
Preferred contact: ${payload.contactMethod}
Language: ${payload.language}
Source: ${payload.source}
Time: ${payload.timestamp}
`
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error("Enquiry delivery failed:", error);
    return res.status(500).json({
      ok: false,
      configured: true,
      message: "We couldn't send your enquiry right now. Please call or WhatsApp us directly."
    });
  }
});

app.use(express.static(path.join(__dirname, "public"), {
  extensions: ["html"]
}));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Sri Balaji website running on http://localhost:${PORT}`);
});
