# Simple Vite + React + Tailwind UI App

This project is a simple React app bootstrapped with Vite, styled with Tailwind CSS, and ready for deployment on Digital Ocean. It is designed to use the Google Sheets API (Service Account) as a database.

## Features

- Vite + React for fast development
- Tailwind CSS for styling
- Tailwind UI components for beautiful UI
- Google Sheets API integration (Service Account)
- Ready for Digital Ocean deployment

## Getting Started

### Development

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```

### Deploy

Upload the `dist` folder to your Digital Ocean app or use the Digital Ocean App Platform for automated deployments.

## Google Sheets API

- Service Account must be set up in the Google Cloud Console.
- Store your credentials securely (e.g., in environment variables or a serverless function).
- The app will fetch and write data to your Google Sheet via the API.

## Customization

- Use Tailwind UI components for rapid UI development.
- Update the Google Sheets integration in the backend or API route as needed.

---

For more details, see the documentation for [Vite](https://vitejs.dev/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), and [Google Sheets API](https://developers.google.com/sheets/api/quickstart/js).
