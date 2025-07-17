// src/googleSheets.js
// Utility to access Google Sheets API using a Service Account
import { google } from '@googleapis/sheets'

export async function getSheetData({ spreadsheetId, range, credentials }) {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  const sheets = google.sheets({ version: 'v4', auth })
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })
  return res.data.values
}

// For write access, change the scope and use sheets.spreadsheets.values.update
