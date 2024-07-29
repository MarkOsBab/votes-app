import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
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
  const [selectedStat, setSelectedStat] = useState(null);
  const [generalChartOptions, setGeneralChartOptions] = useState({
    chart: {
      type: 'column',
      events: {
        render() {
          this.reflow();
        }
      }
    },
    title: {
      text: 'Estadísticas de Votación',
      useHTML: true,
      style: { fontSize: '18px', color: '#000000' }
    },
    xAxis: {
      categories: []
    },
    series: [{
      name: 'Cantidad',
      data: []
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 600
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          },
          chart: {
            height: '300px'
          }
        }
      }]
    }
  });
  const [candidateChartOptions, setCandidateChartOptions] = useState({
    chart: {
      type: 'pie',
      events: {
        render() {
          this.reflow();
        }
      }
    },
    title: {
      text: 'Votos por Candidato',
      useHTML: true,
      style: { fontSize: '18px', color: '#000000' }
    },
    series: [{
      name: 'Votos',
      colorByPoint: true,
      data: []
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 600
        },
        chartOptions: {
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom'
          },
          chart: {
            height: '300px'
          }
        }
      }]
    }
  });

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

        if (response.status === 200) {
          setLoader(false);
          setStats(response.data);
          setGeneralChartOptions(prevOptions => ({
            ...prevOptions,
            xAxis: {
              categories: ['Total Votantes', 'Votos Totales', 'Candidatos', 'Votantes sin Voto']
            },
            series: [{
              name: 'Cantidad',
              data: [
                response.data.totalVoters,
                response.data.totalVotes,
                response.data.candidates,
                response.data.votersWithoutVotes
              ]
            }]
          }));

          const candidateVotesResponse = await axios.get(`${apiUrl}/dashboard/stats/candidate-votes`, {
            headers: {
              'api-token-key': apiKey,
              'Authorization': `Bearer ${decryptedToken}`
            }
          });

          if (candidateVotesResponse.status === 200) {
            const candidateVotesData = candidateVotesResponse.data.map(candidate => ({
              name: `${candidate.name} ${candidate.lastname}`,
              y: candidate.votes
            }));

            setCandidateChartOptions(prevOptions => ({
              ...prevOptions,
              series: [{
                name: 'Votos',
                colorByPoint: true,
                data: candidateVotesData
              }]
            }));
          }
        }
      } catch (error) {
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
      setGeneralChartOptions(prevOptions => ({
        ...prevOptions,
        chart: {
          ...prevOptions.chart,
          height: window.innerWidth < 600 ? '300px' : null,
          width: window.innerWidth < 768 ? window.innerWidth - 150 : null
        }
      }));
      setCandidateChartOptions(prevOptions => ({
        ...prevOptions,
        chart: {
          ...prevOptions.chart,
          height: window.innerWidth < 600 ? '300px' : null,
          width: window.innerWidth < 768 ? window.innerWidth - 150 : null
        }
      }));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleStatsClick = (index) => {
    if (selectedStat === index) {
      setSelectedStat(null);
      setGeneralChartOptions(prevOptions => ({
        ...prevOptions,
        series: [{
          name: 'Cantidad',
          data: prevOptions.series[0].data,
          colorByPoint: true,
          colors: prevOptions.series[0].data.map(() => '#3b82f6')
        }],
        title: {
          text: 'Estadísticas de Votación'
        }
      }));
    } else {
      setSelectedStat(index);
      const categories = ['Total Votantes', 'Votos Totales', 'Candidatos', 'Votantes sin Voto'];
      setGeneralChartOptions(prevOptions => ({
        ...prevOptions,
        series: [{
          name: 'Cantidad',
          data: prevOptions.series[0].data,
          colorByPoint: true,
          colors: prevOptions.series[0].data.map((_, i) => i === index ? '#3b82f6' : '#1e3a8a')
        }],
        title: {
          text: `Estadísticas de ${categories[index]}`
        }
      }));
    }
  };

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
    <div className="min-h-screen flex overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} logoutAdmin={logoutAdmin} />
      <main className={`flex-grow bg-gray-100 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`} onClick={() => setSelectedStat(null)}>
        <h2 className="text-1xl font-bold mb-4">Admin Panel</h2>
        {loader ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Stats 
                title="Total votantes" 
                icon={FaUsers} 
                borderClass="border-blue-200" 
                borderClassHover="hover:border-blue-400/80"
                quantity={stats.totalVoters || 0} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatsClick(0);
                }}
              />
              <Stats 
                title="Votos Totales" 
                icon={FaVoteYea} 
                borderClass="border-orange-200" 
                borderClassHover="hover:border-orange-400/80"
                quantity={stats.totalVotes || 0} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatsClick(1);
                }}
              />
              <Stats 
                title="Candidatos" 
                icon={FaUsers} 
                borderClass="border-green-200" 
                borderClassHover="hover:border-green-400/80"
                quantity={stats.candidates || 0} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatsClick(2);
                }}
              />
              <Stats 
                title="Votantes sin Voto" 
                icon={FaUsers} 
                borderClass="border-red-200" 
                borderClassHover="hover:border-red-400/80"
                quantity={stats.votersWithoutVotes || 0} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatsClick(3);
                }}
              />
            </div>
            <div id="mostVoted" className="w-full mt-6">
              <MostVotedCandidates />
            </div>
            <div className="mt-8 w-full flex flex-wrap justify-between">
              <div className="w-full md:w-1/2 p-2 overflow-hidden">
                <HighchartsReact highcharts={Highcharts} options={generalChartOptions} />
              </div>
              <div className="w-full md:w-1/2 p-2 overflow-hidden">
                <HighchartsReact highcharts={Highcharts} options={candidateChartOptions} />
              </div>
            </div>
          </>
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