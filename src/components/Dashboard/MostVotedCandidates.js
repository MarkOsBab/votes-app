import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import Loader from '../Loader';
import CandidatesTable from './CandidatesTable';
import Placeholder from '../Placeholder';

function MostVotedCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

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
            {Array.from({ length: 10 }).map((_, index) => <Placeholder columns={2} key={index} />)}
          </tbody>
        </table>
      ) : (
        <CandidatesTable candidates={candidates} />
      )}
    </div>
  );
}

export default MostVotedCandidates;