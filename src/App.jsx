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

  // Immer nach Vorhersage (Spalte 6) absteigend sortieren
  const filteredData = Array.isArray(sheetData) && sheetData.length > 1
    ? [
        sheetData[0],
        ...sheetData.slice(1)
          .filter(row => {
            const position = row[3]?.toUpperCase();
            const marketValue = parseFloat(row[4]?.replace(',', '.') || 0);
            const prediction = parseFloat(row[6]?.replace(',', '.') || 0);
            return (
              position === activeFilter &&
              prediction >= minPrediction &&
              marketValue <= maxMarketValue
            );
          })
          .sort((a, b) => {
            const aVal = parseFloat((a[6] || '').toString().replace(',', '.'));
            const bVal = parseFloat((b[6] || '').toString().replace(',', '.'));
            if (isNaN(aVal) && isNaN(bVal)) return 0;
            if (isNaN(aVal)) return 1;
            if (isNaN(bVal)) return -1;
            return bVal - aVal;
          })
      ]
    : sheetData

  // Anzahl der Spieler, die den Filterkriterien entsprechen (ohne Header)
  const filteredCount = Array.isArray(filteredData) && filteredData.length > 1 ? filteredData.length - 1 : 0;

  // Hilfsfunktion für dynamische Klassen
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-6">
        {/* Filter Container */}
        <div className="bg-white rounded-xl shadow pt-2 pb-4 px-4 max-w-4xl w-full mx-auto mb-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="text-xs text-gray-500 font-medium mb-1 sm:mb-0">
              {filteredCount} Spieler entsprechen den aktuellen Kriterien
            </div>
            <div className="w-full max-w-full sm:w-auto sm:max-w-none flex-1">
              <span className="isolate flex w-full max-w-full sm:inline-flex rounded-md shadow-xs">
                {FILTERS.map((filter, idx) => (
                  <button
                    key={filter}
                    type="button"
                    className={
                      `relative inline-flex items-center justify-center w-full max-w-full sm:w-auto sm:max-w-none px-3 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-10 ` +
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
            </div>
            <div className="w-full max-w-full sm:w-auto sm:max-w-none flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-gray-700 w-full sm:w-auto">
                Min. Punktevorhersage: <span className="font-bold">{minPrediction}</span>
              </label>
              <input
                type="range"
                min="0"
                max="350"
                step="1"
                value={minPrediction}
                onChange={e => setMinPrediction(Number(e.target.value))}
                className="w-full max-w-full sm:w-48 sm:max-w-none accent-blue-600"
              />
            </div>
            <div className="w-full max-w-full sm:w-auto sm:max-w-none flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-gray-700 w-full sm:w-auto">
                Max. Marktwert: <span className="font-bold">{maxMarketValue}</span> Mio
              </label>
              <input
                type="range"
                min="0.5"
                max="8.5"
                step="0.1"
                value={maxMarketValue}
                onChange={e => setMaxMarketValue(Number(e.target.value))}
                className="w-full max-w-full sm:w-48 sm:max-w-none accent-red-600"
              />
            </div>
          </div>
        </div>
        {/* Table Container */}
        <div className="bg-white rounded-xl shadow pt-2 pb-4 px-4 max-w-4xl w-full mx-auto">
          {loading && <div className="text-blue-500">Lade Daten...</div>}
          {error && <div className="text-red-500">Fehler: {error}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                {Array.isArray(filteredData) && filteredData.length > 0 && (
                  <tr>
                    {filteredData[0].map((cell, j) => (
                      <th
                        key={j}
                        scope="col"
                        className={classNames(
                          j < 4
                            ? 'sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 px-3 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter'
                            : 'sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 px-3 text-center text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter',
                        )}
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                )}
              </thead>
              <tbody>
                {Array.isArray(filteredData) && filteredData.slice(1).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={classNames(
                          i !== filteredData.length - 2 ? 'border-b border-gray-200' : '',
                          j < 4
                            ? 'px-3 py-3.5 text-sm whitespace-nowrap text-gray-700 text-left'
                            : 'px-3 py-3.5 text-sm whitespace-nowrap text-gray-700 text-center',
                        )}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
