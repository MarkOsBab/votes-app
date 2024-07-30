import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import CandidatesTable from './CandidatesTable';
import Placeholder from '../Placeholder';

function MostVotedCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 5;

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const authToken = Cookies.get('auth_token');
  const jwtSecret = process.env.REACT_APP_JWT_SECRET;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const bytes = CryptoJS.AES.decrypt(authToken, jwtSecret);
        const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

        const response = await axios.get(`${apiUrl}/dashboard/candidates/most-voted`, {
          headers: {
            'api-token-key': apiKey,
            'Authorization': `Bearer ${decryptedToken}`
          }
        });
        setCandidates(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [authToken, jwtSecret, apiUrl, apiKey]);

  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = candidates.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalPages = Math.ceil(candidates.length / candidatesPerPage);

  const handlePageClick = (pageNumber) => {
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
    <div className="p-6 mt-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-normal text-gray-900 mb-2">Candidatos Más Votados</h2>
      {loading ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Nombre</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Votos</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => <Placeholder columns={2} key={index} />)}
          </tbody>
        </table>
      ) : (
        <>
          <CandidatesTable candidates={currentCandidates} />
          {(currentCandidates.length >= 5 ?
            <div className="flex justify-between items-center mt-4">
              <button 
                onClick={() => handlePageClick(currentPage - 1)} 
                disabled={currentPage === 1} 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              >
                Anterior
              </button>
              <div className="flex space-x-1">
                {getPageNumbers().map((pageNumber) => (
                  <button 
                    key={pageNumber} 
                    onClick={() => handlePageClick(pageNumber)} 
                    className={`mx-1 px-3 py-1 border ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} rounded-md hover:bg-blue-700 hover:text-white transition duration-300`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handlePageClick(currentPage + 1)} 
                disabled={currentPage === totalPages} 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          : <></>)}
        </>
      )}
    </div>
  );
}

export default MostVotedCandidates;