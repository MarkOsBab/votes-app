import React, { useState } from 'react';
import axios from 'axios';

function VoterForm() {
  const [document, setDocument] = useState('');
  const [candidate, setCandidate] = useState('');
  const [message, setMessage] = useState('');

  const handleVote = async (e) => {
    e.preventDefault();
    
  };

  return (
    <form onSubmit={handleVote}>
      <div>
        <label htmlFor="document">Documento:</label>
        <input
          type="text"
          id="document"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="candidate">Candidato:</label>
        <select
          id="candidate"
          value={candidate}
          onChange={(e) => setCandidate(e.target.value)}
          required
        >
          <option value="">Seleccione un candidato</option>
          <option value="candidate1">Candidato 1</option>
          <option value="candidate2">Candidato 2</option>
        </select>
      </div>
      <button type="submit">Votar</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default VoterForm;
