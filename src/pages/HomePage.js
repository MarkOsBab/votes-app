import React from 'react';
import VoterForm from '../components/VoterForm';

function HomePage() {
  return (
    <div>
      <h1>Votación</h1>
      <VoterForm />
      <a href="/admin">Acceso a Gestión</a>
    </div>
  );
}

export default HomePage;