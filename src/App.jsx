import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [sheetData, setSheetData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:5174/api/sheet')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSheetData(data)
          setError(null)
        } else if (data && data.error) {
          setError(data.error)
          setSheetData([])
        } else {
          setError('Unbekanntes Server-Response')
          setSheetData([])
        }
      })
      .catch(e => {
        setError(e.message)
        setSheetData([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Google Sheet Daten</h2>
        {loading && <div className="text-blue-500">Lade Daten...</div>}
        {error && <div className="text-red-500">Fehler: {error}</div>}
        <table className="min-w-full border text-sm">
          <tbody>
            {Array.isArray(sheetData) && sheetData.map((row, i) => (
              <tr key={i} className="border-b">
                {row.map((cell, j) => (
                  <td key={j} className="px-2 py-1 border-r">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
