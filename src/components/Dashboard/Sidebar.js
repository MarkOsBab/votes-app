import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaVoteYea, FaList, FaUserPlus, FaKey, FaSignOutAlt, FaHome } from 'react-icons/fa';

function Sidebar({ isOpen, toggleSidebar, logoutAdmin }) {
  return (
    <aside className={`fixed inset-y-0 left-0 bg-gray-800 text-white flex flex-col ${isOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
      <div className="h-16 flex items-center justify-between shadow-md px-4">
        <h1 className={`text-1xl font-bold ${!isOpen && 'hidden'}`}>Admin Panel</h1>
        <button 
          onClick={toggleSidebar} 
          className="focus:outline-none p-4 rounded-lg hover:bg-gray-700 hover:text-white transition duration-300"
        >
          {isOpen ? <FaTimes className="text-1xl" /> : <FaBars className="text-1xl" />}
        </button>
      </div>
      <nav className="flex-grow px-4 py-6">
        <NavLink to="/admin/panel" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 mb-2 transition duration-200">
          <FaHome className="text-1xl" />
          {isOpen && <span className="ml-3">Inicio</span>}
        </NavLink>
        <NavLink to="/admin/panel/add-voter" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 mb-2 transition duration-200">
          <FaUserPlus className="text-1xl" />
          {isOpen && <span className="ml-3">Nuevo votante</span>}
        </NavLink>
        <NavLink to="/admin/panel/change-password" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 mb-2 transition duration-200">
          <FaKey className="text-1xl" />
          {isOpen && <span className="ml-3">Modificar clave</span>}
        </NavLink>
      </nav>
      <div className="px-4 py-6">
        <button onClick={logoutAdmin} className="w-full bg-white text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200 hover:bg-gray-300 flex items-center justify-center">
          <FaSignOutAlt className="text-1xl" />
          {isOpen && <span className="ml-3">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;