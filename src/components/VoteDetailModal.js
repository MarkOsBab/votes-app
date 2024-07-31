import React from 'react';
import { FaUser, FaIdCard, FaBirthdayCake, FaVoteYea, FaCalendarAlt } from 'react-icons/fa';

function VoteDetailModal({ vote, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="w-fit relative mb-4 lg:text-2xl md:text-xl sm:text-lg text-md font-extrabold leading-none tracking-tight text-blue-500 group hover:pl-4 transition-all duration-300">
          <span className="absolute left-0 top-0 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">#</span>
          Detalles del Voto
        </h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <FaUser className="text-blue-500 mr-2" />
            <p className="text-lg font-medium"><strong>Votante:</strong> {vote.voter.name} {vote.voter.lastname}</p>
          </div>
          <div className="flex items-center">
            <FaIdCard className="text-blue-500 mr-2" />
            <p className="text-lg font-medium"><strong>Documento:</strong> {vote.voter.document}</p>
          </div>
          <div className="flex items-center">
            <FaBirthdayCake className="text-blue-500 mr-2" />
            <p className="text-lg font-medium"><strong>Fecha de nacimiento:</strong> {new Date(vote.voter.birth_day).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center">
            <FaVoteYea className="text-blue-500 mr-2" />
            <p className="text-lg font-medium"><strong>Candidato:</strong> {vote.candidate.name} {vote.candidate.lastname}</p>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="text-blue-500 mr-2" />
            <p className="text-lg font-medium"><strong>Fecha de votación:</strong> {new Date(vote.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoteDetailModal;