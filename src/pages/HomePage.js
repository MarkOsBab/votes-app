import React from 'react';
import VoterForm from '../components/VoterForm';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
      <VoterForm />
      <Link to="/admin" className="mt-4 text-blue-500 hover:underline">Acceso a Gestión</Link>
    </div>
  );
}

export default HomePage;
