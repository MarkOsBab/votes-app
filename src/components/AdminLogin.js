import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ButtonLoader from './ButtonLoader';
import ValidationErrorMessage from './ValidationErrorMessage';
import Loader from './Loader';
import AnimatedTitle from './AnimatedTitle';

function AdminLogin() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const jwtSecret = process.env.REACT_APP_JWT_SECRET;

  useEffect(() => {
    const smoothLoading = () => {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    smoothLoading();
  }, []);

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
      if (response.status === 200) {
        const token = response.data.access_token;
        const encryptedToken = CryptoJS.AES.encrypt(token, jwtSecret).toString();
        Cookies.set('auth_token', encryptedToken, { expires: 1, secure: true, sameSite: 'Strict' });
        window.location.href = '/admin/panel';
      }
    } catch (error) {
      if (error.response?.data?.error === 'Error email or password.') {
        setMessage('Error de usuario o contraseña');
      } else {
        setMessage('Ocurrió un error al iniciar sesión.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="w-full bg-white p-20 rounded-xl shadow-sm hover:shadow-lg transition-all duration-1000 ease-in-out">
              <div className="w-full flex flex-col justify-center">
                <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-blue-500">
                  <AnimatedTitle text="Inicia sesión" />
                </h1>
                <p className="mb-6 text-lg font-normal text-gray-500">Ingresa tus credenciales para iniciar sesión</p>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label htmlFor="email" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
                <ValidationErrorMessage name="email" />
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label htmlFor="password" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Contraseña</label>
                <ValidationErrorMessage name="password" />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? <ButtonLoader /> : 'Iniciar Sesión'}
              </button>
              <ul className={`max-w-md space-y-2 list-disc list-inside text-left transition-opacity duration-1000 text-red-500 ${message ? 'opacity-100' : 'opacity-0'}`}>
                {message && (
                  <li key={message}>{message}</li>
                )}
              </ul>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default AdminLogin;