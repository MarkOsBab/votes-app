import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VoteDetailModal from './VoteDetailModal';
import Loader from './Loader';

function Votes({ votes, setVotes, totalPages, currentPage, setCurrentPage, loading }) {
  const [selectedVote, setSelectedVote] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const handleVoteClick = (vote) => {
    setSelectedVote(vote);
  };

  const handlePageClick = async (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="size-3/4 mt-8">
      <h2 className="w-fit relative mb-4 lg:text-2xl md:text-xl sm:text-lg text-md font-extrabold leading-none tracking-tight text-blue-500 group hover:pl-4 transition-all duration-300">
        <span className="absolute left-0 top-0 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">#</span>
        Lista de votos realizados
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Votante</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Candidato</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Fecha</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  <Loader />
                </td>
              </tr>
            ) : votes.length > 0 ? (
              votes.map((vote) => (
                <tr key={vote.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b border-gray-300">{vote.voter.name}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{vote.candidate.name}</td>
                  <td className="py-2 px-4 border-b border-gray-300">{new Date(vote.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b border-gray-300">
                    <button 
                      onClick={() => handleVoteClick(vote)} 
                      className="text-blue-500 hover:underline"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">No hay votos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={() => handlePageClick(currentPage - 1)} 
            disabled={currentPage === 1 || loading} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <div className="flex space-x-1">
            {getPageNumbers().map((pageNumber) => (
              <button 
                key={pageNumber} 
                onClick={() => handlePageClick(pageNumber)} 
                disabled={loading}
                className={`mx-1 px-3 py-1 border ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} rounded-md hover:bg-blue-700 hover:text-white transition duration-300`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
          <button 
            onClick={() => handlePageClick(currentPage + 1)} 
            disabled={currentPage === totalPages || loading} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
      {selectedVote && (
        <VoteDetailModal vote={selectedVote} onClose={() => setSelectedVote(null)} />
      )}
    </div>
  );
}

export default Votes;