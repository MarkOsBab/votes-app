import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';
import Sidebar from '../components/Dashboard/Sidebar';
import Loader from '../components/Loader';
import ButtonLoader from '../components/ButtonLoader';

function ChangeAdminPasswordPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState({
    minLength: false,
    maxLength: false,
    hasUppercase: false,
    hasSymbol: false,
    passwordsMatch: false,
  });

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const authToken = Cookies.get('auth_token');
  const jwtSecret = process.env.REACT_APP_JWT_SECRET;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setValidations({
      minLength: newPassword.length >= 6,
      maxLength: newPassword.length <= 16,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      passwordsMatch: newPassword === confirmPassword,
    });
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validations.passwordsMatch) {
      setError('Las nuevas claves no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const bytes = CryptoJS.AES.decrypt(authToken, jwtSecret);
      const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
      const response = await axios.post(`${apiUrl}/dashboard/management/change-password`, {
        currentPassword,
        newPassword
      }, {
        headers: {
          'api-token-key': apiKey,
          'Authorization': `Bearer ${decryptedToken}`
        }
      });

      if (response.status === 200) {
        setSuccess('Clave actualizada exitosamente.');
        setError('');
        const newTokenResponse = await axios.post(`${apiUrl}/auth/refresh`, {}, {
          headers: {
            'api-token-key': apiKey,
            'Authorization': `Bearer ${decryptedToken}`
          }
        });

        if (newTokenResponse.status === 200) {
          const newToken = newTokenResponse.data.access_token;
          const encryptedToken = CryptoJS.AES.encrypt(newToken, jwtSecret).toString();
          Cookies.set('auth_token', encryptedToken, { expires: 1, secure: true, sameSite: 'Strict' });
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        setError('Error al actualizar la clave.');
      }
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={`flex-grow bg-gray-100 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="flex items-center justify-center bg-gray-100 mt-8">
          <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Modificar clave</h2>
            <div className="mb-4 relative">
              <label htmlFor="currentPassword" className="block text-gray-700">Clave actual</label>
              <input 
                type={showCurrentPassword ? "text" : "password"} 
                id="currentPassword" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="absolute right-0 px-3 py-3 text-gray-500 focus:outline-none"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="mb-4 relative">
              <label htmlFor="newPassword" className="block text-gray-700">Nueva clave</label>
              <input 
                type={showNewPassword ? "text" : "password"} 
                id="newPassword" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="absolute right-0 px-3 py-3 text-gray-500 focus:outline-none"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="mb-4 relative">
              <label htmlFor="confirmPassword" className="block text-gray-700">Confirmar nueva clave</label>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                id="confirmPassword" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="absolute right-0 px-3 py-3 text-gray-500 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {success && <div className="mb-4 text-green-500 text-sm flex gap-2 items-center"><FaCheckCircle size={16}/>{success}</div>}
            {error && <div className="mb-4 text-red-500 text-sm flex gap-2 items-center"><FaExclamationTriangle size={16}/>{error}</div>}
            <ul className="mb-4 text-sm text-gray-700">
              <li className={`flex items-center ${validations.minLength ? 'text-green-600' : 'text-red-600'}`}>
                {validations.minLength ? '✔️' : '❌'} Mínimo 6 caracteres
              </li>
              <li className={`flex items-center ${validations.maxLength ? 'text-green-600' : 'text-red-600'}`}>
                {validations.maxLength ? '✔️' : '❌'} Máximo 16 caracteres
              </li>
              <li className={`flex items-center ${validations.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                {validations.hasUppercase ? '✔️' : '❌'} Una letra mayúscula
              </li>
              <li className={`flex items-center ${validations.hasSymbol ? 'text-green-600' : 'text-red-600'}`}>
                {validations.hasSymbol ? '✔️' : '❌'} Un símbolo
              </li>
              <li className={`flex items-center ${validations.passwordsMatch && newPassword !== '' ? 'text-green-600' : 'text-red-600'}`}>
                {validations.passwordsMatch && newPassword !== '' ? '✔️' : '❌'} Las claves coinciden
              </li>
              <li className={`flex items-center ${newPassword === currentPassword && newPassword !== '' ? 'text-red-600' : 'text-green-600'}`}>
                {newPassword === currentPassword && newPassword !== '' ? '❌' : '✔️'} La nueva clave no puede ser igual a la anterior
              </li>
            </ul>
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              disabled={!validations.minLength || !validations.maxLength || !validations.hasUppercase || !validations.hasSymbol || !validations.passwordsMatch || newPassword === currentPassword}
            >
              {loading ? <ButtonLoader /> : 'Actualizar clave'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ChangeAdminPasswordPage;