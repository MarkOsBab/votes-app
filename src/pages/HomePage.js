import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import VoterForm from '../components/VoterForm';
import Votes from '../components/Votes';
import WinningCandidate from '../components/WinningCandidate';
import { Link } from 'react-router-dom';

function HomePage() {
  const [votes, setVotes] = useState([]);
  const [winningCandidate, setWinningCandidate] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchVotes = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/votes?votes=${page}`, {
        headers: {
          'api-token-key': apiKey,
        },
      });
      setVotes(response.data.votes.data);
      setTotalPages(response.data.votes.last_page);
      setWinningCandidate(response.data.mostVoted);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching votes:', error);
      setLoading(false);
    }
  }, [apiUrl, apiKey]);

  useEffect(() => {
    fetchVotes(currentPage);
  }, [fetchVotes, currentPage]);

  const handleNewVote = (newVote) => {
    fetchVotes(currentPage);
  };

  return (
    <div className="w-full p-4 lg:p-20 md:p-16 sm:p-12">
      <div className="w-full flex flex-col justify-center items-center">
        <VoterForm onNewVote={handleNewVote} />
        <div className="flex justify-center size-3/4 my-2">
          {winningCandidate && <WinningCandidate candidate={winningCandidate} />}
        </div>
        <Votes 
          votes={votes} 
          setVotes={setVotes} 
          totalPages={totalPages} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          loading={loading} 
        />
      </div>
      <div className="w-full flex justify-end items-end">
        <Link to="/admin" className="mt-4 text-blue-500 hover:underline">Acceso a Gestión</Link>
      </div>
    </div>
  );
}

export default HomePage;