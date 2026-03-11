// Build-time script: Fetches data from Google Sheets and writes to public/data.json
import pkg from '@googleapis/sheets'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const google = pkg.default || pkg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function fetchSheetData() {
  const requiredVars = [
    'VITE_GSHEET_PRIVATE_KEY',
    'VITE_GSHEET_CLIENT_EMAIL',
    'VITE_GSHEET_SPREADSHEET_ID',
    'VITE_GSHEET_RANGE',
  ]

  for (const v of requiredVars) {
    if (!process.env[v]) {
      console.error(`Missing required environment variable: ${v}`)
      process.exit(1)
    }
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: process.env.VITE_GSHEET_TYPE || 'service_account',
      project_id: process.env.VITE_GSHEET_PROJECT_ID,
      private_key_id: process.env.VITE_GSHEET_PRIVATE_KEY_ID,
      private_key: process.env.VITE_GSHEET_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.VITE_GSHEET_CLIENT_EMAIL,
      client_id: process.env.VITE_GSHEET_CLIENT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  const sheets = google.sheets({ version: 'v4', auth })
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.VITE_GSHEET_SPREADSHEET_ID,
    range: process.env.VITE_GSHEET_RANGE,
  })

  const data = result.data.values
  const outPath = path.join(__dirname, '..', 'public', 'data.json')
  fs.writeFileSync(outPath, JSON.stringify(data))
  console.log(`Wrote ${data.length} rows to public/data.json`)
}

fetchSheetData().catch((err) => {
  console.error('Failed to fetch sheet data:', err.message)
  process.exit(1)
})
