import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Statische Dateien servieren
app.use(express.static(path.join(__dirname, 'dist')))

// Test-Route
app.get('/test', (req, res) => {
  res.json({ message: 'Server läuft!' })
})

// Catch-all für SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const PORT = 8080
app.listen(PORT, () => {
  console.log(`Test-Server läuft auf http://localhost:${PORT}`)
})
