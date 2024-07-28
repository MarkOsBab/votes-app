import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import Stats from '../components/Dashboard/Stats';
import Notification from '../components/Dashboard/Notification';
import Loader from '../components/Loader';
import MostVotedCandidates from '../components/Dashboard/MostVotedCandidates';
import Sidebar from '../components/Dashboard/Sidebar';
import { FaUsers, FaVoteYea } from 'react-icons/fa';

function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

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
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} logoutAdmin={logoutAdmin} />
      <main className="flex-grow bg-gray-100 p-6 transition-all duration-300 ml-64">
        <h2 className="text-1xl font-bold mb-4">Admin Panel</h2>
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
        <div id="mostVoted" className="w-full mt-6">
          <MostVotedCandidates />
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
        </div>
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