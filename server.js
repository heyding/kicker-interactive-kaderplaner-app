import express from 'express'
import pkg from '@googleapis/sheets'
const google = pkg.default || pkg
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
const port = 5174

app.get('/api/sheet', async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: process.env.VITE_GSHEET_TYPE,
        project_id: process.env.VITE_GSHEET_PROJECT_ID,
        private_key_id: process.env.VITE_GSHEET_PRIVATE_KEY_ID,
        private_key: process.env.VITE_GSHEET_PRIVATE_KEY?.replace(/\\n/g, '\n'),
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
    res.json(result.data.values)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(port, () => {
  console.log(`Google Sheets Proxy listening on http://localhost:${port}`)
})
