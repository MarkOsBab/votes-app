import React from 'react';
import { FaCrown } from 'react-icons/fa';

function WinningCandidate({ candidate }) {
  if (!candidate) {
    return null;
  }

  return (
    <div className="w-full bg-white py-2 px-4 rounded-lg shadow-sm flex items-center mb-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-center w-16 h-14 bg-blue-500 rounded-full">
        <FaCrown className="text-white lg:text-3xl md:text-2xl sm:text-xl" />
      </div>
      <div className="ml-4 w-full">
        <h2 className="lg:text-2xl md:text-xl sm:text-lg text-xl font-extrabold text-gray-800">Candidato más votado</h2>
        <p className="lg:text-xl md:text-lg sm:text-base text-lg text-gray-600">{candidate.name} {candidate.lastname}</p>
        <p className="text-gray-500 lg:text-3xl md:text-2xl sm:text-xl text-2xl text-end">Votos: #{candidate.total}</p>
      </div>
    </div>
  );
}

export default WinningCandidate;