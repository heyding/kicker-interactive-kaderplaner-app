# Kicker Interactive Kaderplaner

Interaktive React-App zur Auswertung von Kicker-Daten mit Google Sheets als Datenquelle.

## Stack

- React + Vite
- Tailwind CSS
- Google Sheets API (Service Account)
- Deployment auf GitHub Pages via GitHub Actions

## Datenfluss

1. Der Workflow startet bei Push auf main oder manuell.
2. scripts/fetch-data.js lädt die Daten aus Google Sheets.
3. Die Daten werden als public/data.json in den Build übernommen.
4. Vite erzeugt den statischen Build in dist.
5. Der Build wird nach GitHub Pages deployed.

## Voraussetzungen

- Node.js 18+
- Google Cloud Projekt mit aktivierter Sheets API
- Service Account mit Zugriff auf das Ziel-Sheet

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Optional mit lokalem Backend:

```bash
npm run dev:backend
```

## Build

Nur Frontend-Build:

```bash
npm run build
```

Build mit aktuellem Google-Sheets-Import:

```bash
npm run build:full
```

## Erforderliche Umgebungsvariablen

Diese Variablen werden vom Build-Script genutzt:

- VITE_GSHEET_TYPE
- VITE_GSHEET_PROJECT_ID
- VITE_GSHEET_PRIVATE_KEY_ID
- VITE_GSHEET_PRIVATE_KEY
- VITE_GSHEET_CLIENT_EMAIL
- VITE_GSHEET_CLIENT_ID
- VITE_GSHEET_SPREADSHEET_ID
- VITE_GSHEET_RANGE

Hinweise:

- VITE_GSHEET_PRIVATE_KEY muss den kompletten Key enthalten inklusive BEGIN/END.
- Zeilenumbrueche im Key als \n speichern.
- VITE_GSHEET_SPREADSHEET_ID ist nur die ID, nicht die komplette URL.
- VITE_GSHEET_RANGE im Format TabName!A1:Z500, bei Leerzeichen im Tabnamen: 'Tab Name'!A1:Z500.

## GitHub Actions / GitHub Pages

Workflow: .github/workflows/deploy.yml

Die oben genannten Werte als Actions Secrets hinterlegen:

Settings > Secrets and variables > Actions > Secrets

## Haeufige Fehler

Missing required environment variable

- Secret fehlt, ist falsch benannt oder leer.

Requested entity was not found

- Spreadsheet ID falsch oder Service Account hat keinen Zugriff.

Unable to parse range

- Range-Syntax ungueltig oder Tabname stimmt nicht exakt.
