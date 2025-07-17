import express from 'express'
import pkg from '@googleapis/sheets'
const google = pkg.default || pkg
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
const port = 5174

// Simple In-Memory Cache
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 Minuten in Millisekunden

// Hilfsfunktion für Cache-Bereinigung
function cleanupCache() {
  const now = Date.now()
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key)
      console.log(`Cache-Eintrag ${key} bereinigt`)
    }
  }
}

// Cache-Bereinigung alle 10 Minuten
setInterval(cleanupCache, 10 * 60 * 1000)

app.get('/api/sheet', async (req, res) => {
  try {
    const cacheKey = 'sheet-data'
    const now = Date.now()
    
    // Prüfen ob Cache-Eintrag vorhanden und noch gültig
    const cachedData = cache.get(cacheKey)
    if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
      console.log('Cache Hit - Daten aus Cache geliefert')
      return res.json(cachedData.data)
    }
    
    console.log('Cache Miss - Daten von Google Sheets abgerufen')
    
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
    
    const data = result.data.values
    
    // Daten im Cache speichern
    cache.set(cacheKey, {
      data: data,
      timestamp: now
    })
    
    console.log(`Daten erfolgreich gecacht (${data?.length || 0} Zeilen)`)
    res.json(data)
    
  } catch (e) {
    console.error('Fehler beim Abrufen der Daten:', e.message)
    res.status(500).json({ error: e.message })
  }
})

// Cache-Status Endpoint (optional, für Debugging)
app.get('/api/cache-status', (req, res) => {
  const cacheKey = 'sheet-data'
  const cachedData = cache.get(cacheKey)
  
  if (cachedData) {
    const age = Date.now() - cachedData.timestamp
    const remainingTime = CACHE_DURATION - age
    
    res.json({
      cached: true,
      age: Math.round(age / 1000) + 's',
      remainingTime: Math.round(remainingTime / 1000) + 's',
      dataSize: cachedData.data?.length || 0
    })
  } else {
    res.json({
      cached: false,
      message: 'Keine Daten im Cache'
    })
  }
})

app.listen(port, () => {
  console.log(`Google Sheets Proxy mit Cache listening on http://localhost:${port}`)
  console.log(`Cache-Dauer: ${CACHE_DURATION / 1000} Sekunden`)
})
