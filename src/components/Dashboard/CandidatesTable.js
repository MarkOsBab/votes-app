import React from 'react';

function CandidatesTable({ candidates }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">
              Nombre del Candidato
            </th>
            <th className="px-6 py-3">
              Votos
            </th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {candidate.name} {candidate.lastname}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {candidate.votes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CandidatesTable;