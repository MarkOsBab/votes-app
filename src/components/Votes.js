import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VoteDetailModal from './VoteDetailModal';
import Loader from './Loader';

function Votes({ votes, setVotes }) {
  const [loading, setLoading] = useState(true);
  const [selectedVote, setSelectedVote] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await axios.get(`${apiUrl}/votes`, {
          headers: {
            'api-token-key': apiKey,
          }
        });
        setVotes(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchVotes();
  }, [apiUrl, apiKey, setVotes]);

  const handleVoteClick = (vote) => {
    setSelectedVote(vote);
  };

  return (
    <div className="size-3/4 mt-8">
      <h2 className="w-fit relative mb-4 lg:text-2xl md:text-xl sm:text-lg text-md font-extrabold leading-none tracking-tight text-blue-500 group hover:pl-4 transition-all duration-300">
        <span className="absolute left-0 top-0 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">#</span>
        Lista de votos realizados
      </h2>
      <div className="overflow-x-auto">
        {loading ? (
          <Loader />
        ) : (
          votes.length > 0 ? (
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
                {votes.map((vote) => (
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
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No hay votos registrados.</p>
          )
        )}
      </div>
      {selectedVote && (
        <VoteDetailModal vote={selectedVote} onClose={() => setSelectedVote(null)} />
      )}
    </div>
  );
}

export default Votes;