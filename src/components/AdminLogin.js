import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ButtonLoader from './ButtonLoader';

function AdminLogin() {
  const [message, setMessage] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const jwtSecret = process.env.REACT_APP_JWT_SECRET;

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('El email no es válido')
      .required('El email es requerido'),
    password: Yup.string()
      .required('La contraseña es requerida'),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    setMessage('');
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, values, {
        headers: {
          'api-token-key': apiKey,
        }
      });
      setMessage('Acceso correcto');
      if (response.status === 200) {
        const token = response.data.access_token;
        const encryptedToken = CryptoJS.AES.encrypt(token, jwtSecret).toString();
        Cookies.set('auth_token', encryptedToken, { expires: 1, secure: true, sameSite: 'Strict' });
        window.location.href = '/admin/panel';
      }
    } catch (error) {
      if(error.response?.data?.error === 'Error email or password.') {
        setMessage('Error de usuario o contraseña');
      } else {
        setMessage('Ocurrió un error al iniciar sesión.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
      {({ isSubmitting }) => (
        <Form className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-left">Email:</label>
            <Field
              type="email"
              name="email"
              id="email"
              className="w-full px-3 py-2 border rounded"
            />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-left">Contraseña:</label>
            <Field
              type="password"
              name="password"
              id="password"
              className="w-full px-3 py-2 border rounded"
            />
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? <ButtonLoader /> : 'Iniciar Sesión'}
          </button>
          {message && <p className="mt-4 text-center">{message}</p>}
        </Form>
      )}
    </Formik>
  );
}

export default AdminLogin;