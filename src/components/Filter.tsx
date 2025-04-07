import React from 'react'

interface FilterProps {
    filterType: string;
    setFilterType: React.Dispatch<React.SetStateAction<string>>;
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    order: 'asc' | 'desc';
    setOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
}

const Filter: React.FC<FilterProps> = ({filterType, setFilterType, sortBy, setSortBy, order, setOrder})=> {
  return (
<>

  {/* Filter + Sorting Controls */}
  <div className="flex md:w-[900px] flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-800 p-4 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <label className="text-gray-300 font-medium w-full sm:w-auto">
            Filter by Threat Type:
          </label>
          <input
            type="text"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            placeholder="e.g. phishing"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex flex-col">
            <label htmlFor="sortBy" className="text-gray-300 text-sm mb-1">Sort by</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date_added">Date Added</option>
              <option value="host">Host</option>
              <option value="threat_type">Threat Type</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="order" className="text-gray-300 text-sm mb-1">Order</label>
            <select
              id="order"
              value={order}
              onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
              className="bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

</>
  )
}

export default Filter
