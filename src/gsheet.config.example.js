// src/gsheet.config.example.js
// Rename to gsheet.config.js and fill in your credentials and spreadsheet info

export const G_SHEET_CONFIG = {
  credentials: {
    // type: 'service_account',
    // project_id: '',
    // private_key_id: '',
    // private_key: '',
    // client_email: '',
    // client_id: '',
    // ...
  },
  spreadsheetId: '', // Your Google Sheet ID
  range: 'Sheet1!A1:Z500', // Adjust as needed
}
