import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const FILTERS = [
  'GOALKEEPER',
  'DEFENDER',
  'MIDFIELDER',
  'FORWARD',
]

function App() {
  const [count, setCount] = useState(0)
  const [sheetData, setSheetData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('FORWARD')
  const [minPrediction, setMinPrediction] = useState(150)
  const [maxMarketValue, setMaxMarketValue] = useState(5)

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

  // Filtered data: skip header row, filter by position (Spalte 4, index 3),
  // market value (Spalte 5, index 4), prediction (Spalte 7, index 6)
  const filteredData = Array.isArray(sheetData) && sheetData.length > 1
    ? [
        sheetData[0],
        ...sheetData.slice(1).filter(row => {
          const position = row[3]?.toUpperCase()
          const marketValue = parseFloat(row[4]?.replace(',', '.') || 0)
          const prediction = parseFloat(row[6]?.replace(',', '.') || 0)
          return (
            position === activeFilter &&
            prediction >= minPrediction &&
            marketValue <= maxMarketValue
          )
        })
      ]
    : sheetData

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
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
          <span className="isolate inline-flex rounded-md shadow-xs">
            {FILTERS.map((filter, idx) => (
              <button
                key={filter}
                type="button"
                className={
                  `relative inline-flex items-center px-3 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-10 ` +
                  (idx === 0 ? 'rounded-l-md ' : '-ml-px ')
                  + (idx === FILTERS.length - 1 ? 'rounded-r-md ' : '')
                  + (activeFilter === filter
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-900 hover:bg-gray-50')
                }
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0) + filter.slice(1).toLowerCase()}
              </button>
            ))}
          </span>
          <div className="flex flex-col items-start gap-2">
            <label className="text-sm font-medium text-gray-700">
              Min. Punktevorhersage: <span className="font-bold">{minPrediction}</span>
            </label>
            <input
              type="range"
              min="0"
              max="350"
              step="1"
              value={minPrediction}
              onChange={e => setMinPrediction(Number(e.target.value))}
              className="w-48 accent-blue-600"
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <label className="text-sm font-medium text-gray-700">
              Max. Marktwert: <span className="font-bold">{maxMarketValue}</span> Mio
            </label>
            <input
              type="range"
              min="0.5"
              max="8.5"
              step="0.1"
              value={maxMarketValue}
              onChange={e => setMaxMarketValue(Number(e.target.value))}
              className="w-48 accent-red-600"
            />
          </div>
        </div>
        {loading && <div className="text-blue-500">Lade Daten...</div>}
        {error && <div className="text-red-500">Fehler: {error}</div>}
        <table className="min-w-full border text-sm">
          <tbody>
            {Array.isArray(filteredData) && filteredData.map((row, i) => (
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
