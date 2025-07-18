# ⚽ Kicker Interactive - Player Analysis App

Eine moderne, responsive React-Webapp zur Analyse von Fußballspielern mit Google Sheets Integration. Die App bietet intelligente Filter, Sortierung und Performance-Optimierungen für eine optimale Benutzererfahrung.

## 🚀 Features

### 🎯 **Kernfunktionen**
- **Intelligente Filterung**: Nach Position, Vorhersage-Punkte und Marktwert
- **Sortierbare Tabelle**: Spalten 7, 9, 10 mit visuellen Indikatoren
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile
- **Deutsche Lokalisierung**: Vollständig in deutscher Sprache
- **Tooltips**: Detaillierte Erklärungen für komplexe Spalten

### ⚡ **Performance-Optimierungen**
- **Backend-Caching**: 5-Minuten In-Memory Cache für Google Sheets API
- **Frontend-Optimierung**: useMemo, debouncing, React.memo
- **Gzip-Kompression**: ~68% kleinere Übertragungsgrößen
- **Service Worker**: Offline-Support und erweiterte Caching-Strategien
- **Code-Splitting**: Optimierte Bundle-Größen für schnellere Ladezeiten

### 🎨 **UI/UX**
- **Tailwind CSS v4+**: Moderne, responsive Gestaltung
- **Tailwind UI Design**: Professionelle Komponenten
- **Inter Font**: Optimierte Typografie
- **Error Boundary**: Graceful Error-Handling
- **Loading States**: Benutzerfreundliche Ladezustände

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4+
- **Backend**: Node.js, Express.js, Google Sheets API
- **Deployment**: Digital Ocean App Platform
- **Caching**: In-Memory + Service Worker
- **Build**: Terser, Gzip, Code-Splitting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Google Cloud Console Account
- Google Service Account für Sheets API

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd kicker-app

# Dependencies installieren
npm install

# Environment Variables einrichten
cp .env.example .env
# Bearbeite .env mit deinen Google Sheets Credentials
```

### Development

```bash
# Development Server starten
npm run dev

# Backend Server starten (separates Terminal)
npm run server

# App öffnet sich auf http://localhost:5173/
# Frontend: http://localhost:5173/
# Backend: http://localhost:8080/ (oder process.env.PORT)
```

### Production Build

```bash
# Optimierten Build erstellen
npm run build

# Build lokal testen
npm run preview
```

## 🔧 Konfiguration

### Google Sheets API Setup

1. **Google Cloud Console**:
   - Neues Projekt erstellen
   - Google Sheets API aktivieren
   - Service Account erstellen
   - JSON-Key herunterladen

2. **Environment Variables** (`.env`):
   ```env
   VITE_GSHEET_TYPE=service_account
   VITE_GSHEET_PROJECT_ID=your-project-id
   VITE_GSHEET_PRIVATE_KEY_ID=your-private-key-id
   VITE_GSHEET_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   VITE_GSHEET_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   VITE_GSHEET_CLIENT_ID=your-client-id
   VITE_GSHEET_SPREADSHEET_ID=your-spreadsheet-id
   VITE_GSHEET_RANGE=Sheet1!A1:Z1000
   ```

3. **Google Sheet**:
   - Service Account Email zur Sheet hinzufügen (Editor-Berechtigung)
   - Datenformat: Spalte 1-10 mit Spielerinformationen
   - Spalte 4: Position (GOALKEEPER, DEFENDER, MIDFIELDER, FORWARD)
   - Spalte 5: Marktwert (numerisch)
   - Spalte 7: Vorhersage-Punkte (numerisch)

## 📊 Datenstruktur

### Erwartete Spalten:
1. **ID/Name** - Spieler-Identifikation
2. **Name** - Spielername
3. **Team** - Vereinsname
4. **Position** - GOALKEEPER/DEFENDER/MIDFIELDER/FORWARD
5. **Marktwert** - Numerischer Wert in Mio
6. **Punkte** - Aktuelle Punkte
7. **Vorhersage** - Prognostizierte Punkte
8. **Spiele** - Anzahl Spiele
9. **Ø Punkte** - Durchschnittspunkte
10. **Performance** - Performance-Ratio

## 🎯 Filterlogik

### Position Filter
- **Tor**: GOALKEEPER
- **Abwehr**: DEFENDER
- **Mittelfeld**: MIDFIELDER
- **Sturm**: FORWARD

### Slider Filter
- **Min. Punkte**: 0-350 (Vorhersage-Spalte)
- **Max. Marktwert**: 0.5-8.5 Mio

### Sortierung
- **Standard**: Spalte 7 (Vorhersage) absteigend
- **Sortierbar**: Spalten 7, 9, 10 mit Klick-Indikatoren

## 🚀 Deployment

### Digital Ocean App Platform

1. **Repository verbinden**:
   ```bash
   # Git Repository pushen
   git push origin main
   ```

2. **App erstellen**:
   - Digital Ocean Dashboard → Apps → Create App
   - GitHub Repository auswählen
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables setzen**:
   - Alle `VITE_GSHEET_*` Variablen hinzufügen
   - `NODE_ENV=production` setzen

4. **Build Settings**:
   ```yaml
   # app.yaml
   name: kicker-app
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/kicker-app
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     build_command: npm run build
   ```

## 🚀 Deployment Status

### ✅ **Erfolgreich behoben (18. Juli 2025)**

1. **Port-Konfiguration**: Server läuft jetzt auf Port 8080 für Digital Ocean
2. **SPA-Routing**: Catch-all Route funktioniert mit `app.use()` statt `app.get('*')`
3. **Statische Dateien**: Frontend wird korrekt aus `dist/` serviert
4. **API-Integration**: Alle Endpunkte funktionieren einwandfrei

### 🔄 **Deployment-Schritte**
```bash
# 1. Code committen
git add .
git commit -m "Fix SPA routing and Digital Ocean port configuration"
git push origin main

# 2. In Digital Ocean wird automatisch deployed
# 3. Health Checks sollten jetzt erfolgreich sein
# 4. App ist unter der Digital Ocean URL erreichbar
```

### 📋 **Changelog**

**v1.1.0** (18. Juli 2025)
- 🐛 Fix: "Cannot GET /" Error durch korrektes SPA-Routing
- 🐛 Fix: Digital Ocean Health Check durch Port 8080 Konfiguration
- ✨ Feature: Robuste Error-Handling für fehlende Frontend-Dateien
- 🔧 Improvement: Debug-Logging für bessere Fehlerdiagnose

**v1.0.0** (Initial Release)
- ✨ Vite + React + Tailwind CSS Setup
- ✨ Google Sheets API Integration
- ✨ Responsive Tabelle mit Filtern
- ✨ Caching und Performance-Optimierungen
- ✨ Service Worker für Offline-Support

## 🔧 Troubleshooting

### Digital Ocean Health Check Error
**Problem**: `ERROR failed health checks after 13 attempts with error Readiness probe failed: dial tcp 10.244.12.129:8080: connect: connection refused`

**Lösung**: Digital Ocean erwartet, dass die App auf Port 8080 läuft. Das Backend verwendet automatisch `process.env.PORT` (von Digital Ocean gesetzt) oder als Fallback Port 8080.

**Wichtige Änderungen**:
- Backend hört auf `process.env.PORT || 8080`
- Backend bindet an `0.0.0.0` statt `localhost`
- Frontend nutzt relative API-Pfade (`/api/sheet`)
- Vite-Proxy konfiguriert für lokale Entwicklung

### "Cannot GET /" Error
**Problem**: `Cannot GET /` beim Aufruf der Root-URL

**Lösung**: Express-Router hatte Probleme mit `app.get('*', ...)` Syntax. Geändert zu `app.use(...)` für robuste SPA-Routing.

**Wichtige Änderungen**:
- Catch-all Route: `app.get('*', ...)` → `app.use(...)`
- Statische Dateien werden aus `dist/` serviert
- SPA-Routing funktioniert für alle Frontend-Routen
- Fallback auf `index.html` für unbekannte Routen

### Environment Variables
Stelle sicher, dass alle `VITE_GSHEET_*` Variablen in Digital Ocean konfiguriert sind:
- `VITE_GSHEET_TYPE`
- `VITE_GSHEET_PROJECT_ID`  
- `VITE_GSHEET_PRIVATE_KEY_ID`
- `VITE_GSHEET_PRIVATE_KEY`
- `VITE_GSHEET_CLIENT_EMAIL`
- `VITE_GSHEET_CLIENT_ID`
- `VITE_GSHEET_SPREADSHEET_ID`
- `VITE_GSHEET_RANGE`

## 🔍 API Endpoints

### Backend API
- `GET /api/sheet` - Holt Spielerdaten (mit Caching)
- `GET /api/cache-status` - Cache-Status und Statistiken
- `GET /api/health` - Server-Health und Performance-Metriken

### Response Format
```json
{
  "cached": true,
  "age": "45s",
  "remainingTime": "255s",
  "dataSize": 150,
  "etag": "abc123..."
}
```

## 🎨 Customization

### Styling
```css
/* src/index.css */
@import "tailwindcss";

/* Custom styles hier hinzufügen */
```

### Konfiguration
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      }
    }
  }
}
```

## 📈 Performance

### Benchmark-Ergebnisse
- **Erste Ladung**: ~800ms
- **Wiederholte Besuche**: ~150ms (Cache)
- **Bundle-Größe**: 57.91 kB (gzipped)
- **Lighthouse Score**: 95+ (Performance)

### Optimierungen
- **Debouncing**: 300ms für Slider-Inputs
- **React.memo**: Tabellen-Komponenten
- **useMemo**: Filter-Berechnungen
- **Service Worker**: Offline-Caching
- **HTTP-Caching**: ETag + Cache-Control

## 🐛 Debugging

### Development
```bash
# Verbose Logging
DEBUG=true npm run dev

# Cache Status prüfen
curl http://localhost:8080/api/cache-status

# Health Check
curl http://localhost:8080/api/health
```

### Production Testing
```bash
# Lokaler Build-Test
npm run build
npm start

# Test Root-Route
curl http://localhost:8080/

# Test API
curl http://localhost:8080/api/sheet

# Test SPA-Routing
curl http://localhost:8080/some-route
```

### Häufige Probleme

**1. "Cannot GET /" Error**
- Prüfe ob `dist/` Ordner existiert: `ls -la dist/`
- Führe Build aus: `npm run build`
- Starte Server neu: `npm start`

**2. API-Daten werden nicht geladen**
- Prüfe Environment Variables in `.env`
- Teste API direkt: `curl http://localhost:8080/api/sheet`
- Prüfe Google Sheets Berechtigung

**3. Health Check Fehler**
- Server muss auf Port 8080 laufen (Digital Ocean)
- Backend bindet an `0.0.0.0` nicht `localhost`
- Environment Variable `PORT` wird automatisch gesetzt

## 📞 Support

### Production
```bash
# Build analysieren
npm run build -- --bundle-analyzer

# Performance testen
npm run preview
```

## 🤝 Contributing

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/amazing-feature`)
3. Änderungen committen (`git commit -m 'Add amazing feature'`)
4. Branch pushen (`git push origin feature/amazing-feature`)
5. Pull Request erstellen

## 📄 License

MIT License - siehe [LICENSE](LICENSE) für Details.

## 🔗 Links

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Digital Ocean App Platform](https://www.digitalocean.com/products/app-platform)

## 📞 Support

Bei Fragen oder Problemen:
- GitHub Issues erstellen
- Dokumentation prüfen
- Performance-Logs analysieren

---

**Entwickelt mit ❤️ für optimale Fußball-Datenanalyse**
