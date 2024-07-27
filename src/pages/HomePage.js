import React from 'react';
import VoterForm from '../components/VoterForm';

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 font-sans">Votación</h1>
      <VoterForm />
      <a href="/admin" className="mt-4 text-blue-500 hover:underline">Acceso a Gestión</a>
    </div>
  );
}

export default HomePage;
