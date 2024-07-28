import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaVoteYea, FaList, FaUserPlus, FaKey, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import Stats from '../components/Dashboard/Stats';
import Notification from '../components/Dashboard/Notification';
import Loader from '../components/Loader';

function AdminPanel() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({});
  const [loader, setLoader] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const authToken = Cookies.get('auth_token');
  const jwtSecret = process.env.REACT_APP_JWT_SECRET;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const getStats = async () => {
      setLoader(true);
      try {
        const bytes = CryptoJS.AES.decrypt(authToken, jwtSecret);
        const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

        const response = await axios.get(`${apiUrl}/dashboard/stats`, {
          headers: {
            'api-token-key': apiKey,
            'Authorization': `Bearer ${decryptedToken}`
          }
        });

        if(response.status === 200) {
          setLoader(false);
          setStats(response.data);
        }
      } catch(error) {
        setLoader(false);
        setNotification({ show: true, type: 'error', message: 'Error obteniendo las estadísticas' });
      }
    }
    getStats();
  }, [authToken, jwtSecret, apiUrl, apiKey]);

  const logoutAdmin = async (e) => {
    e.preventDefault();
    try {
      const bytes = CryptoJS.AES.decrypt(authToken, jwtSecret);
      const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
      const response = await axios.post(`${apiUrl}/auth/logout`, {}, {
        headers: {
          'api-token-key': apiKey,
          'Authorization': `Bearer ${decryptedToken}`
        }
      });

      if (response.status === 200) {
        Cookies.remove('auth_token');
        navigate('/admin');
      }
    } catch (error) {
      Cookies.remove('auth_token');
      navigate('/admin');
      setNotification({ show: true, type: 'error', message: 'Error inesperado al cerrar la sesión, serás redirigido' });
    }
  }

  return (
    <div className="min-h-screen flex">
      <aside className={`bg-gray-800 text-white flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
        <div className="h-16 flex items-center justify-between shadow-md px-4">
          <h1 className={`text-1xl font-bold ${!isSidebarOpen && 'hidden'}`}>Admin Panel</h1>
          <button 
            onClick={toggleSidebar} 
            className="focus:outline-none p-4 rounded-lg hover:bg-gray-700 hover:text-white transition duration-300"
          >
            {isSidebarOpen ? <FaTimes className="text-1xl" /> : <FaBars className="text-1xl" />}
          </button>
        </div>
        <nav className="flex-grow px-4 py-6">
          <NavLink to="/admin/panel/candidates" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 mb-2 transition duration-200">
            <FaVoteYea className="text-1xl" />
            {isSidebarOpen && <span className="ml-3">Más votados</span>}
          </NavLink>
          <NavLink to="/admin/panel/votes" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 mb-2 transition duration-200">
            <FaList className="text-1xl" />
            {isSidebarOpen && <span className="ml-3">Votos ingresados</span>}
          </NavLink>
          <NavLink to="/admin/panel/add-voter" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 mb-2 transition duration-200">
            <FaUserPlus className="text-1xl" />
            {isSidebarOpen && <span className="ml-3">Nuevo votante</span>}
          </NavLink>
          <NavLink to="/admin/panel/change-password" className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 mb-2 transition duration-200">
            <FaKey className="text-1xl" />
            {isSidebarOpen && <span className="ml-3">Modificar clave</span>}
          </NavLink>
        </nav>
        <div className="px-4 py-6">
          <button onClick={logoutAdmin} className="w-full bg-white text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200 hover:bg-gray-300 flex items-center justify-center">
            <FaSignOutAlt className="text-1xl" />
            {isSidebarOpen && <span className="ml-3">Cerrar sesión</span>}
          </button>
        </div>
      </aside>
      <main className="flex-grow bg-gray-100 p-6 transition-all duration-300">
        <h2 className="text-1xl font-bold mb-4">Dashboard</h2>
        {loader ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Stats 
              title="Total votantes" 
              icon={FaUsers} 
              borderClass="border-blue-200" 
              borderClassHover="hover:border-blue-400/80"
              quantity={stats.totalVoters || 0} 
            />
            <Stats 
              title="Votos Totales" 
              icon={FaVoteYea} 
              borderClass="border-orange-200" 
              borderClassHover="hover:border-orange-400/80"
              quantity={stats.totalVotes || 0} 
            />
            <Stats 
              title="Candidatos" 
              icon={FaUsers} 
              borderClass="border-green-200" 
              borderClassHover="hover:border-green-400/80"
              quantity={stats.candidates || 0} 
            />
            <Stats 
              title="Votantes sin Voto" 
              icon={FaUsers} 
              borderClass="border-red-200" 
              borderClassHover="hover:border-red-400/80"
              quantity={stats.votersWithoutVotes || 0} 
            />
          </div>
        )}
      </main>
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ show: false, type: '', message: '' })}
        />
      )}
    </div>
  );
}

export default AdminPanel;