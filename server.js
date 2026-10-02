import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const publicDir = path.join(__dirname, "public");
const quoteFilesDir = path.join(__dirname, "quote-files");

// -----------------------------------------------------------------------------
// Security
// -----------------------------------------------------------------------------

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    }
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "100kb"
  })
);

// -----------------------------------------------------------------------------
// Upload configuration
// -----------------------------------------------------------------------------

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 3;

const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png"
]);

const allowedExtensions = new Set([
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png"
]);

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES
  },

  fileFilter: (_req, file, cb) => {
    const extension = path
      .extname(file.originalname || "")
      .toLowerCase();

    /*
     * Accept a file when either its MIME type OR its extension
     * is explicitly allowed.
     */
    const validMime =
      allowedMimeTypes.has(file.mimetype);

    const validExtension =
      allowedExtensions.has(extension);

    cb(null, validMime || validExtension);
  }
});

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function clean(value, maxLength = 3000) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function validPhone(phone) {
  return /^(?:\x2B91[\s-]?)?[6-9]\d{9}$/.test(
    String(phone || "")
      .replace(/[()]/g, "")
      .trim()
  );
}

function safeFileName(originalName) {
  const extension = path
    .extname(originalName || "")
    .toLowerCase();

  const safeExtension =
    allowedExtensions.has(extension)
      ? extension
      : "";

  return `${Date.now()}-${randomUUID()}${safeExtension}`;
}

async function saveUploadedFiles(files = []) {
  if (!files.length) {
    return [];
  }

  await fs.mkdir(quoteFilesDir, {
    recursive: true
  });

  const savedFiles = [];

  for (const file of files) {
    const filename = safeFileName(
      file.originalname
    );

    if (!filename) {
      continue;
    }

    const destination = path.join(
      quoteFilesDir,
      filename
    );

    await fs.writeFile(
      destination,
      file.buffer
    );

    savedFiles.push({
      name: clean(
        file.originalname,
        200
      ),

      filename,

      url:
        `/quote-files/${encodeURIComponent(
          filename
        )}`,

      contentType: file.mimetype,

      size: file.size
    });
  }

  return savedFiles;
}

function getPublicBaseUrl(req) {
  const configured =
    process.env.PUBLIC_BASE_URL ||
    process.env.RAILWAY_PUBLIC_DOMAIN ||
    "";

  if (configured) {
    return configured.replace(
      /\/+$/,
      ""
    );
  }

  const protocol =
    req.headers["x-forwarded-proto"] ||
    req.protocol ||
    "http";

  const host =
    req.headers["x-forwarded-host"] ||
    req.get("host");

  return `${protocol}://${host}`;
}

function enquiryText({
  name,
  phone,
  requirement,
  contactMethod,
  language,
  source,
  shopName,
  location,
  category,
  quantity,
  files,
  baseUrl
}) {
  const lines = [
    "SRI BALAJI PIPES & ELECTRICALS",
    "",
    "New Quote / Product Enquiry",
    "",
    `Name: ${name}`,
    `Shop / Company: ${
      shopName || "Not provided"
    }`,
    `Phone: ${phone}`,
    `Location: ${
      location || "Not provided"
    }`,
    `Category: ${
      category || "Not provided"
    }`,
    `Quantity: ${
      quantity || "Not provided"
    }`,
    `Preferred contact: ${
      contactMethod || "Not provided"
    }`,
    `Language: ${
      language || "English"
    }`,
    `Source: ${
      source || "Website"
    }`,
    "",
    "Requirement:",
    requirement,
    "",
    "Documents:"
  ];

  if (!files.length) {
    lines.push("None attached");
  } else {
    for (const file of files) {
      lines.push(
        `${file.name}: ${baseUrl}${file.url}`
      );
    }
  }

  return lines.join("\n");
}

// -----------------------------------------------------------------------------
// SMTP
// -----------------------------------------------------------------------------

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.ADMIN_EMAIL
  );
}

function createTransporter() {
  if (!smtpConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,

    port: Number(
      process.env.SMTP_PORT || 587
    ),

    secure:
      String(
        process.env.SMTP_PORT || "587"
      ) === "465",

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// -----------------------------------------------------------------------------
// WhatsApp Cloud API
// -----------------------------------------------------------------------------

/*
 * Keep the API version configurable from Railway.
 *
 * Railway can later contain:
 *
 * WHATSAPP_API_VERSION=v25.0
 *
 * v25.0 is used as the safe default here.
 */
const WHATSAPP_API_VERSION =
  process.env.WHATSAPP_API_VERSION ||
  "v25.0";

function whatsappConfigured() {
  return Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_TO_NUMBER
  );
}

async function whatsappRequest(
  endpoint,
  options = {}
) {
  const token =
    process.env.WHATSAPP_ACCESS_TOKEN;

  if (!token) {
    throw new Error(
      "WhatsApp access token is not configured."
    );
  }

  const response = await fetch(
    `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${endpoint}`,
    {
      ...options,

      headers: {
        Authorization:
          `Bearer ${token}`,

        ...(options.headers || {})
      }
    }
  );

  const responseText =
    await response.text();

  let data;

  try {
    data =
      JSON.parse(responseText);
  } catch {
    data = {
      raw: responseText
    };
  }

  if (!response.ok) {
    const errorMessage =
      data?.error?.message ||
      data?.error?.error_user_msg ||
      `WhatsApp API returned HTTP ${response.status}`;

    throw new Error(errorMessage);
  }

  return data;
}

// -----------------------------------------------------------------------------
// WhatsApp file validation
// -----------------------------------------------------------------------------

function validateWhatsAppFile(file) {
  if (!file) {
    throw new Error(
      "Invalid WhatsApp file."
    );
  }

  const mimeType =
    file.mimetype || "";

  /*
   * WhatsApp Cloud API supports PDF documents and
   * JPEG/PNG images. Images have a 5 MB limit.
   * Our website already limits all uploads to 10 MB.
   */
  if (
    mimeType === "image/jpeg" ||
    mimeType === "image/png"
  ) {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(
        `"${file.originalname}" is larger than WhatsApp's 5 MB image limit.`
      );
    }

    return;
  }

  if (
    mimeType === "application/pdf"
  ) {
    if (
      file.size >
      100 * 1024 * 1024
    ) {
      throw new Error(
        `"${file.originalname}" is larger than WhatsApp's document limit.`
      );
    }

    return;
  }

  throw new Error(
    `"${file.originalname}" is not a supported WhatsApp file type.`
  );
}

// -----------------------------------------------------------------------------
// Upload media to WhatsApp
// -----------------------------------------------------------------------------

async function uploadWhatsAppMedia(
  file
) {
  validateWhatsAppFile(file);

  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!phoneNumberId) {
    throw new Error(
      "WhatsApp phone number ID is not configured."
    );
  }

  const form = new FormData();

  form.append(
    "messaging_product",
    "whatsapp"
  );

  form.append(
    "type",
    file.mimetype
  );

  form.append(
    "file",
    new Blob(
      [file.buffer],
      {
        type: file.mimetype
      }
    ),
    file.originalname
  );

  return whatsappRequest(
    `${phoneNumberId}/media`,
    {
      method: "POST",
      body: form
    }
  );
}

// -----------------------------------------------------------------------------
// Send WhatsApp text
// -----------------------------------------------------------------------------

async function sendWhatsAppText(
  text
) {
  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID;

  const to =
    process.env.WHATSAPP_TO_NUMBER;

  if (!phoneNumberId || !to) {
    throw new Error(
      "WhatsApp phone number ID or recipient number is not configured."
    );
  }

  /*
   * WhatsApp text messages have a maximum body
   * length of 4096 characters.
   */
  const safeText =
    String(text || "").slice(
      0,
      4096
    );

  return whatsappRequest(
    `${phoneNumberId}/messages`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        messaging_product:
          "whatsapp",

        recipient_type:
          "individual",

        to,

        type: "text",

        text: {
          preview_url: false,
          body: safeText
        }
      })
    }
  );
}

// -----------------------------------------------------------------------------
// Send WhatsApp image/document
// -----------------------------------------------------------------------------

async function sendWhatsAppMedia(
  file,
  mediaId
) {
  const phoneNumberId =
    process.env.WHATSAPP_PHONE_NUMBER_ID;

  const to =
    process.env.WHATSAPP_TO_NUMBER;

  if (!phoneNumberId || !to) {
    throw new Error(
      "WhatsApp phone number ID or recipient number is not configured."
    );
  }

  const isImage =
    file.mimetype ===
      "image/jpeg" ||
    file.mimetype ===
      "image/png";

  const type = isImage
    ? "image"
    : "document";

  const mediaPayload = isImage
    ? {
        id: mediaId
      }
    : {
        id: mediaId,
        filename:
          file.originalname
      };

  return whatsappRequest(
    `${phoneNumberId}/messages`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        messaging_product:
          "whatsapp",

        recipient_type:
          "individual",

        to,

        type,

        [type]: mediaPayload
      })
    }
  );
}

// -----------------------------------------------------------------------------
// Complete WhatsApp quote flow
// -----------------------------------------------------------------------------

async function sendQuoteToWhatsApp({
  files,
  message
}) {
  if (!whatsappConfigured()) {
    throw new Error(
      "WhatsApp Cloud API is not configured."
    );
  }

  /*
   * Send the enquiry details first.
   */
  const textResult =
    await sendWhatsAppText(
      message
    );

  const results = [];

  /*
   * Upload each original file to WhatsApp,
   * then send it using the returned media ID.
   */
  for (const file of files) {
    const uploaded =
      await uploadWhatsAppMedia(
        file
      );

    const mediaId =
      uploaded?.id;

    if (!mediaId) {
      throw new Error(
        "WhatsApp media upload did not return a media ID."
      );
    }

    const sent =
      await sendWhatsAppMedia(
        file,
        mediaId
      );

    results.push({
      name:
        file.originalname,

      mediaId,

      messageId:
        sent?.messages?.[0]?.id ||
        null
    });
  }

  return {
    textMessageId:
      textResult?.messages?.[0]?.id ||
      null,

    files: results
  };
}

// -----------------------------------------------------------------------------
// Enquiry API
// -----------------------------------------------------------------------------

app.post(
  "/api/enquiry",

  upload.array(
    "files",
    MAX_FILES
  ),

  async (req, res) => {
    try {
      const {
        name,
        phone,
        requirement,
        contactMethod,
        language,
        source,
        shopName,
        location,
        category,
        quantity
      } = req.body || {};

      const cleanName =
        clean(name, 100);

      const cleanPhone =
        String(phone || "")
          .replace(/[()]/g, "")
          .trim();

      const cleanRequirement =
        clean(
          requirement,
          3000
        );

      if (
        !cleanName ||
        !validPhone(cleanPhone) ||
        !cleanRequirement
      ) {
        return res.status(400).json({
          ok: false,

          message:
            "Please enter a valid name, Indian phone number and requirement."
        });
      }

      const uploadedFiles =
        await saveUploadedFiles(
          req.files || []
        );

      const baseUrl =
        getPublicBaseUrl(req);

      const data = {
        name: cleanName,

        phone: cleanPhone,

        requirement:
          cleanRequirement,

        contactMethod:
          clean(
            contactMethod,
            50
          ),

        language:
          clean(
            language,
            30
          ),

        source:
          clean(
            source,
            50
          ),

        shopName:
          clean(
            shopName,
            150
          ),

        location:
          clean(
            location,
            150
          ),

        category:
          clean(
            category,
            100
          ),

        quantity:
          clean(
            quantity,
            200
          ),

        files:
          uploadedFiles,

        baseUrl
      };

      const message =
        enquiryText(data);

      // -----------------------------------------------------------------------
      // WhatsApp Cloud API
      // -----------------------------------------------------------------------

      if (
        source ===
          "Website Quote WhatsApp"
      ) {
        if (
          !whatsappConfigured()
        ) {
          return res.status(503).json({
            ok: false,

            configured: false,

            message:
              "WhatsApp Cloud API is not configured yet.",

            files:
              uploadedFiles,

            whatsappMessage:
              message
          });
        }

        try {
          const whatsappResult =
            await sendQuoteToWhatsApp({
              files:
                req.files || [],

              message
            });

          return res.json({
            ok: true,

            configured: true,

            whatsapp: true,

            message:
              "Your quote and selected files were sent to WhatsApp successfully.",

            files:
              uploadedFiles,

            whatsappResult
          });
        } catch (whatsappError) {
          console.error(
            "WhatsApp Cloud API error:",
            whatsappError
          );

          return res.status(502).json({
            ok: false,

            configured: true,

            whatsapp: false,

            message:
              `WhatsApp could not send the quote: ${whatsappError.message}`,

            files:
              uploadedFiles,

            whatsappMessage:
              message
          });
        }
      }

      // -----------------------------------------------------------------------
      // SMS source
      // -----------------------------------------------------------------------

      if (
        source ===
          "Website Quote SMS"
      ) {
        return res.json({
          ok: true,

          configured: false,

          message:
            "Files uploaded successfully. Your message is ready to share.",

          files:
            uploadedFiles,

          whatsappMessage:
            message
        });
      }

      // -----------------------------------------------------------------------
      // Email configured
      // -----------------------------------------------------------------------

      const transporter =
        createTransporter();

      if (transporter) {
        const attachments =
          (req.files || []).map(
            (file) => ({
              filename:
                file.originalname,

              content:
                file.buffer,

              contentType:
                file.mimetype
            })
          );

        await transporter.sendMail({
          from:
            process.env.MAIL_FROM ||
            process.env.SMTP_USER,

          to:
            process.env.ADMIN_EMAIL,

          subject:
            `Sri Balaji Quote Enquiry - ${cleanName}`,

          text:
            message,

          attachments
        });

        return res.json({
          ok: true,

          configured: true,

          message:
            "Your enquiry has been sent successfully.",

          files:
            uploadedFiles
        });
      }

      // -----------------------------------------------------------------------
      // Email not configured
      // -----------------------------------------------------------------------

      return res.json({
        ok: false,

        configured: false,

        message:
          "Online enquiry service is not configured yet. Please use WhatsApp or SMS to send the enquiry directly.",

        files:
          uploadedFiles,

        whatsappMessage:
          message
      });
    } catch (error) {
      console.error(
        "Enquiry error:",
        error
      );

      if (
        error instanceof
        multer.MulterError
      ) {
        if (
          error.code ===
          "LIMIT_FILE_SIZE"
        ) {
          return res.status(400).json({
            ok: false,

            message:
              "Each file must be 10 MB or smaller."
          });
        }

        if (
          error.code ===
          "LIMIT_FILE_COUNT"
        ) {
          return res.status(400).json({
            ok: false,

            message:
              "You can upload a maximum of 3 files."
          });
        }

        return res.status(400).json({
          ok: false,

          message:
            "Please use PDF, JPG or PNG files up to 10 MB each, with a maximum of 3 files."
        });
      }

      return res.status(500).json({
        ok: false,

        message:
          "We could not process your enquiry. Please use WhatsApp or call us directly."
      });
    }
  }
);

// -----------------------------------------------------------------------------
// Static uploaded quote files
// -----------------------------------------------------------------------------

app.use(
  "/quote-files",

  express.static(
    quoteFilesDir,
    {
      index: false,

      dotfiles: "deny",

      fallthrough: false,

      setHeaders(res) {
        res.setHeader(
          "X-Content-Type-Options",
          "nosniff"
        );

        res.setHeader(
          "Content-Disposition",
          "inline"
        );
      }
    }
  )
);

// -----------------------------------------------------------------------------
// Static website
// -----------------------------------------------------------------------------

app.use(
  express.static(
    publicDir,
    {
      maxAge: "1h"
    }
  )
);

// -----------------------------------------------------------------------------
// Fallback
// -----------------------------------------------------------------------------

app.get(
  "*",
  (_req, res) => {
    res.sendFile(
      path.join(
        publicDir,
        "index.html"
      )
    );
  }
);

// -----------------------------------------------------------------------------
// Start
// -----------------------------------------------------------------------------

app.listen(
  PORT,
  () => {
    console.log(
      `Sri Balaji website running on http://localhost:${PORT}`
    );

    console.log(
      `WhatsApp Cloud API configured: ${whatsappConfigured()}`
    );
  }
);