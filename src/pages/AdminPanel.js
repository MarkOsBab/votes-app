import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaVoteYea, FaList, FaUserPlus, FaKey, FaSignOutAlt } from 'react-icons/fa';

function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex">
      <aside className={`bg-gray-800 text-white flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
        <div className="h-16 flex items-center justify-between shadow-md px-4">
          <h1 className={`text-1xl font-bold ${!isSidebarOpen && 'hidden'}`}>Admin Panel</h1>
          <button onClick={toggleSidebar} className="focus:outline-none">
            {isSidebarOpen ? <FaTimes className="text-1xl" /> : <FaBars className="text-1xl" />}
          </button>
        </div>
        <nav className="flex-grow px-4 py-6">
          <NavLink to="/admin/panel/candidates" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 mb-2 transition duration-200">
            <FaVoteYea className="text-2xl" />
            {isSidebarOpen && <span className="ml-3">Más votados</span>}
          </NavLink>
          <NavLink to="/admin/panel/votes" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 mb-2 transition duration-200">
            <FaList className="text-2xl" />
            {isSidebarOpen && <span className="ml-3">Votos ingresados</span>}
          </NavLink>
          <NavLink to="/admin/panel/add-voter" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 mb-2 transition duration-200">
            <FaUserPlus className="text-2xl" />
            {isSidebarOpen && <span className="ml-3">Nuevo votante</span>}
          </NavLink>
          <NavLink to="/admin/panel/change-password" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 mb-2 transition duration-200">
            <FaKey className="text-2xl" />
            {isSidebarOpen && <span className="ml-3">Modificar clave</span>}
          </NavLink>
        </nav>
        <div className="px-4 py-6">
        <button className="w-full bg-white text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200 hover:bg-gray-300 flex items-center justify-center">
          <FaSignOutAlt className="text-2xl" />
          {isSidebarOpen && <span className="ml-3">Cerrar sesión</span>}
        </button>
        </div>
      </aside>
      <main className="flex-grow bg-gray-100 p-6 transition-all duration-300">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div>
          
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;