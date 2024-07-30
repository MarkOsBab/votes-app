import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;
  const authToken = Cookies.get('auth_token');
  const jwtSecret = process.env.REACT_APP_JWT_SECRET;

  const refreshAuthToken = useCallback(async () => {
    try {
      const bytes = CryptoJS.AES.decrypt(authToken, jwtSecret);
      const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

      const response = await axios.post(`${apiUrl}/auth/refresh`, {}, {
        headers: {
          'api-token-key': process.env.REACT_APP_API_KEY,
          'Authorization': `Bearer ${decryptedToken}`
        }
      });

      const newToken = response.data.access_token;
      const encryptedToken = CryptoJS.AES.encrypt(newToken, jwtSecret).toString();
      Cookies.set('auth_token', encryptedToken, { expires: 1, secure: true, sameSite: 'Strict' });
      
      setIsAuthenticated(true);
    } catch (e) {
      Cookies.remove('auth_token');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [authToken, apiUrl, jwtSecret]);

  useEffect(() => {
    const checkTokenExpiry = async () => {
      if (authToken) {
        try {
          const bytes = CryptoJS.AES.decrypt(authToken, jwtSecret);
          const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
          const decodedToken = jwtDecode(decryptedToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            await refreshAuthToken();
          } else {
            setIsAuthenticated(true);
            setLoading(false);
          }
        } catch (e) {
          Cookies.remove('auth_token');
          setIsAuthenticated(false);
          setLoading(false);
        }
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60000);

    return () => clearInterval(interval);
  }, [authToken, jwtSecret, refreshAuthToken]);

  if (loading) {
    return <div></div>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin" />;
};

export default PrivateRoute;