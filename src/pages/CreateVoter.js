import React, { useEffect, useState } from "react";
import axios from 'axios';
import Sidebar from "../components/Dashboard/Sidebar";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import Loader from "../components/Loader";
import ValidationErrorMessage from "../components/ValidationErrorMessage";
import ButtonLoader from "../components/ButtonLoader";

function CreateVoter() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [fullScreenLoading, setFullScreenLoading] = useState(true);
  const [submitting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageType, setMessageType] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;
  const authToken = Cookies.get('auth_token');
  const jwtSecret = process.env.REACT_APP_JWT_SECRET;

  useEffect(() => {
    const smoothLoading = () => {
      setTimeout(() => {
        setFullScreenLoading(false);
      }, 500);
    };
    smoothLoading();
  }, []);

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

  const validationSchema = Yup.object().shape({
    document: Yup.string()
      .matches(/^[0-9]+$/, 'El documento debe contener solo números')
      .required('El documento es requerido'),
    type: Yup.string().required('El tipo es requerido'),
    firstName: Yup.string().min(3, 'El nombre debe contener mínimo 3 caracteres').required('El nombre es requerido'),
    lastName: Yup.string().min(3, 'El apellido debe contener mínimo 3 caracteres').required('El apellido es requerido'),
    dob: Yup.date()
      .required('La fecha de nacimiento es requerida')
      .test('is-adult', 'Debes ser mayor de edad', value => {
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        return (
          age > 18 ||
          (age === 18 && monthDifference > 0) ||
          (age === 18 && monthDifference === 0 && today.getDate() >= birthDate.getDate())
        );
      }),
    address: Yup.string().required('La dirección es requerida'),
    phone: Yup.string().required('El teléfono es requerido'),
    gender: Yup.string().required('El sexo es requerido'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setMessages([]);
    setMessageType('');

    const payload = {
      document: values.document,
      name: values.firstName,
      lastName: values.lastName,
      dob: values.dob,
      is_candidate: values.type === 'candidate' ? 1 : 0,
    };

    const bytes = CryptoJS.AES.decrypt(authToken, jwtSecret);
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

    try {
      await axios.post(`${apiUrl}/dashboard/management/create-voters`, payload, {
        headers: {
          'api-token-key': apiKey,
          'Authorization': `Bearer ${decryptedToken}`
        },
      });

      setMessages(['Votante creado con éxito']);
      setMessageType('success');
      resetForm();
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data || {};
        let messages = [];

        for (const key in errors) {
          messages.push(...errors[key]);
        }

        setMessages(messages);
        setMessageType('error');
      } else {
        setMessages(['Error de conexión o servidor.']);
        setMessageType('error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {fullScreenLoading && <Loader />}
      <div className={`min-h-screen flex transition-opacity duration-1000 ${fullScreenLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`flex-grow bg-gray-100 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="flex items-center justify-center bg-gray-100 mt-8">
            <Formik
              initialValues={{ 
                document: '', 
                type: '', 
                firstName: '', 
                lastName: '', 
                dob: '', 
                address: '', 
                phone: '', 
                gender: '' 
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              {({ isSubmitting }) => (
                <Form className="w-full max-w-6xl bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-normal text-gray-900 mb-2">Crear votante</h2>
                  <div className="mb-4">
                    <label htmlFor="document" className="block text-gray-700">Documento</label>
                    <Field 
                      type="text" 
                      id="document" 
                      name="document" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    />
                    <ValidationErrorMessage name="document"/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label htmlFor="firstName" className="block text-gray-700">Nombre</label>
                      <Field 
                        type="text" 
                        id="firstName" 
                        name="firstName" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      />
                      <ValidationErrorMessage name="firstName"/>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="lastName" className="block text-gray-700">Apellido</label>
                      <Field 
                        type="text" 
                        id="lastName" 
                        name="lastName" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      />
                      <ValidationErrorMessage name="lastName"/>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="dob" className="block text-gray-700">Fecha de nacimiento</label>
                      <Field 
                        type="date" 
                        id="dob" 
                        name="dob" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      />
                      <ValidationErrorMessage name="dob"/>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="address" className="block text-gray-700">Dirección</label>
                      <Field 
                        type="text" 
                        id="address" 
                        name="address" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      />
                      <ValidationErrorMessage name="address"/>
                    </div>
                    <div className="mb-4 flex-1">
                      <label htmlFor="phone" className="block text-gray-700">Teléfono</label>
                      <Field 
                        type="text" 
                        id="phone" 
                        name="phone" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      />
                      <ValidationErrorMessage name="phone"/>
                    </div>
                    <div className="mb-4 flex-1">
                      <label htmlFor="gender" className="block text-gray-700">Sexo</label>
                      <Field 
                        as="select" 
                        id="gender" 
                        name="gender" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Seleccione</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                      </Field>
                      <ValidationErrorMessage name="gender"/>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="type" className="block text-gray-700">Tipo</label>
                    <div role="group" aria-labelledby="type">
                      <label>
                        <Field type="radio" name="type" value="voter" />
                        Votante
                      </label>
                      <label className="ml-4">
                        <Field type="radio" name="type" value="candidate" />
                        Candidato
                      </label>
                    </div>
                    <ValidationErrorMessage name="type"/>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
                    disabled={isSubmitting || submitting}
                  >
                    {isSubmitting || submitting ? <ButtonLoader /> : 'Crear votante'}
                  </button>
                  <ul className={`max-w-md space-y-2 list-disc list-inside text-left py-4 transition-opacity duration-1000 ${messageType === 'success' ? 'text-green-700' : 'text-red-700'} ${messages.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
                    {messages.length > 0 && (
                      messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                      ))
                    )}
                  </ul>
                </Form>
              )}
            </Formik>
          </div>
        </main>
      </div>
    </>
  );
}

export default CreateVoter;