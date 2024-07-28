import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import VoterForm from '../components/VoterForm';
import Votes from '../components/Votes';
import WinningCandidate from '../components/WinningCandidate';
import { Link } from 'react-router-dom';

function HomePage() {
  const [votes, setVotes] = useState([]);
  const [winningCandidate, setWinningCandidate] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchVotes = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/votes`, {
        headers: {
          'api-token-key': apiKey,
        },
      });
      setVotes(response.data);
      updateWinningCandidate(response.data);
    } catch (error) {
      console.error('Error fetching votes:', error);
    }
  }, [apiUrl, apiKey]);

  useEffect(() => {
    fetchVotes();
  }, [fetchVotes]);

  const updateWinningCandidate = (votes) => {
    const candidateVotes = votes.reduce((acc, vote) => {
      acc[vote.candidate.id] = acc[vote.candidate.id] || { ...vote.candidate, votes: 0 };
      acc[vote.candidate.id].votes += 1;
      return acc;
    }, {});

    const winningCandidate = Object.values(candidateVotes).reduce(
      (max, candidate) => (candidate.votes > max.votes ? candidate : max),
      { votes: 0 }
    );

    setWinningCandidate(winningCandidate.votes > 0 ? winningCandidate : null);
  };

  const handleNewVote = (newVote) => {
    const updatedVotes = [...votes, newVote];
    setVotes(updatedVotes);
    updateWinningCandidate(updatedVotes);
  };

  return (
    <div className="w-full p-4 lg:p-20 md:p-16 sm:p-12">
      <div className="w-full flex flex-col justify-center items-center">
        <VoterForm onNewVote={handleNewVote} />
        <div className="flex justify-center size-3/4 my-2">
          {winningCandidate && <WinningCandidate candidate={winningCandidate} />}
        </div>
        <Votes votes={votes} setVotes={setVotes} />
      </div>
      <div className="w-full flex justify-end items-end">
        <Link to="/admin" className="mt-4 text-blue-500 hover:underline">Acceso a Gestión</Link>
      </div>
    </div>
  );
}

export default HomePage;