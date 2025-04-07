import React from 'react'

interface Threat {
threats: any[];
isData: boolean;
}

const TableData:  React.FC<Threat>  =( { threats, isData }) => {
  return (
  <>
     <div className="w-full mt-6 overflow-x-auto">

<table className="md:w-[900px] w-full text-sm text-left text-gray-400 rounded-xl border border-gray-700 shadow-md">
  <thead className="bg-gray-900 text-gray-300 uppercase tracking-wider text-xs">
    <tr>
      <th className="px-4 py-3 border-b border-gray-700">Host</th>
      <th className="px-4 py-3 border-b border-gray-700">URL</th>
      <th className="px-4 py-3 border-b border-gray-700">Threat Type</th>
      <th className="px-4 py-3 border-b border-gray-700">Date Added</th>
    </tr>
  </thead>
  <tbody className="bg-gray-800 divide-y divide-gray-700">
    {!isData ? (
      <tr>
        <td colSpan={4} className="text-center py-6 text-gray-400">
          No Data Available
        </td>
      </tr>
    ) : (
      threats.map((threat, index) => (
        <tr key={index} className="hover:bg-gray-700 transition duration-150">
          <td className="px-4 py-3 text-gray-100 whitespace-nowrap break-words">
            {threat.host}
          </td>
          <td className="px-4 py-3 break-all text-blue-400 hover:underline">
            <a href={threat.url} target="_blank" rel="noopener noreferrer">
              {threat.url}
            </a>
          </td>
          <td className="px-4 py-3 text-red-400 font-semibold whitespace-nowrap">
            {threat.threat_type}
          </td>
          <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
            {threat.date_added}
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>


</div>
  </>
  )
}

export default TableData
