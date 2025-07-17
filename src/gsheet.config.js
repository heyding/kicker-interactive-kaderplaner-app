// src/gsheet.config.js
// Fülle die Werte mit deinen echten Service Account Credentials und Sheet-Infos aus
export const G_SHEET_CONFIG = {
  credentials: {
    "type": import.meta.env.VITE_GSHEET_TYPE,
    "project_id": import.meta.env.VITE_GSHEET_PROJECT_ID,
    "private_key_id": import.meta.env.VITE_GSHEET_PRIVATE_KEY_ID,
    "private_key": import.meta.env.VITE_GSHEET_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    "client_email": import.meta.env.VITE_GSHEET_CLIENT_EMAIL,
    "client_id": import.meta.env.VITE_GSHEET_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/s2kikp%40kikp-465915.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
},
  spreadsheetId: import.meta.env.VITE_GSHEET_SPREADSHEET_ID,
  range: import.meta.env.VITE_GSHEET_RANGE,
}
