import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import AdminLogin from '../components/AdminLogin';

const AdminPage = () => {
  const navigate = useNavigate();
  const jwtSecret = process.env.REACT_APP_JWT_SECRET;
  const authToken = Cookies.get('auth_token');

  useEffect(() => {
    if (authToken) {
      try {
        const bytes = CryptoJS.AES.decrypt(authToken, jwtSecret);
        const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
        if (decryptedToken) {
          navigate('/admin/panel');
        }
      } catch (e) {
        Cookies.remove('auth_token');
      }
    }
  }, [authToken, jwtSecret, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <AdminLogin />
    </div>
  );
};

export default AdminPage;
