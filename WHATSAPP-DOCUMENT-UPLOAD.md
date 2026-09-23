# WhatsApp document upload

The quote form now uploads selected PDF/JPG/PNG files to the website before opening WhatsApp.
WhatsApp receives the enquiry text plus secure, opaque download URLs for the uploaded files.

- Maximum 3 files
- Maximum 10 MB per file
- Allowed: PDF, JPG, PNG
- Uploaded files are stored temporarily and cleaned after approximately 24 hours
- The normal email enquiry path remains intact
- No WhatsApp API credentials are required for this link-based flow

After replacing these files in the existing repository, run `npm install`, test locally, commit, push `master`, and let Railway redeploy.
