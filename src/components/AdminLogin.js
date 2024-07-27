import React, { useState } from 'react';
import axios from 'axios';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}auth/login`, { email, password }, {
        headers: {
          'api-token-key': apiKey,
        }
      });
      setMessage('Acceso correcto');
      if (response.status) {
        window.location.href = '/admin/panel';
      }
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-left">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 text-left">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
        Iniciar Sesión
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
}

export default AdminLogin;
