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
    <form onSubmit={handleVote} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="document" className="block text-gray-700">Documento:</label>
        <input
          type="text"
          id="document"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="candidate" className="block text-gray-700">Candidato:</label>
        <select
          id="candidate"
          value={candidate}
          onChange={(e) => setCandidate(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Seleccione un candidato</option>
          <option value="candidate1">Candidato 1</option>
          <option value="candidate2">Candidato 2</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
        Votar
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
}

export default VoterForm;
