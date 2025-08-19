import { useState, useEffect, useRef } from 'react'

const BaseTableSelector = ({ bases, tables, onBaseSelect, onTableSelect, loading }) => {
  const [selectedBase, setSelectedBase] = useState(null)
  const [selectedTable, setSelectedTable] = useState(null)
  const selectedBaseRef = useRef(null)

  useEffect(() => {
    console.log('BaseTableSelector: props changed → bases:', bases.length, 'tables:', tables.length, 'loading:', loading)
  }, [bases, tables, loading])

  const handleBaseSelect = (e, base) => {
    if (e && e.preventDefault) e.preventDefault()
    if (e && e.stopPropagation) e.stopPropagation()
    console.log('BaseTableSelector: base clicked:', base)
    selectedBaseRef.current = base
    setSelectedBase(base)
    setSelectedTable(null)
    onBaseSelect(base.id)
    setTimeout(() => {
      const section = document.getElementById('table-section')
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  useEffect(() => {
    // Keep ref in sync with state
    selectedBaseRef.current = selectedBase
  }, [selectedBase])

  const handleTableSelect = (base, table) => {
    const effectiveBase = base || selectedBaseRef.current
    console.log('BaseTableSelector: table clicked:', table, 'for base:', effectiveBase)
    setSelectedTable(table)
    if (effectiveBase?.id) {
      onTableSelect(effectiveBase.id, effectiveBase.name, table.id, table.name)
    } else {
      console.warn('BaseTableSelector: No base selected when table clicked')
    }
  }

  return (
    <div className="space-y-8">
      {/* Base Selection */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Airtable Base</h2>
        {bases.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No bases found. Make sure you have access to Airtable bases.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bases.map((base) => (
              <button
                key={base.id}
                type="button"
                onClick={(e) => handleBaseSelect(e, base)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedBase?.id === base.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <h3 className="font-medium text-gray-900">{base.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {base.permissionLevel || 'Base'}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table Selection */}
      {(selectedBase || tables.length > 0) && (
        <div id="table-section">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Select Table from "{selectedBase?.name || 'selected base'}"
          </h2>
          <p className="text-xs text-gray-500 mb-4">Tables loaded: {tables.length} • Loading: {String(loading)}</p>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading tables...</span>
            </div>
          ) : tables.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tables found in this base.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tables.map((table) => (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => handleTableSelect(selectedBase, table)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedTable?.id === table.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <h3 className="font-medium text-gray-900">{table.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {table.description || 'Table'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BaseTableSelector