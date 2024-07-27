import React from 'react';
import AdminLogin from '../components/AdminLogin';

function AdminPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 font-sans">Administración</h1>
      <AdminLogin />
    </div>
  );
}

export default AdminPage;
