import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';
import ButtonLoader from './ButtonLoader';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ValidationErrorMessage from './ValidationErrorMessage';
import AnimatedTitle from './AnimatedTitle';

function VoterForm({ onNewVote }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageType, setMessageType] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${apiUrl}/candidates`, {
          headers: {
            'api-token-key': apiKey,
          },
        });
        setCandidates(response.data);
        setLoading(false);
      } catch (error) {
        setMessages(['Error al cargar los candidatos']);
        setMessageType('error');
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [apiUrl, apiKey]);

  const validationSchema = Yup.object().shape({
    document: Yup.string()
      .matches(/^\d+$/, 'El documento debe ser un número válido')
      .required('El documento es requerido'),
    candidate: Yup.string().required('El candidato es requerido'),
  });

  const handleVote = async (values, { setSubmitting }) => {
    setMessages([]);
    setMessageType('');

    try {
      const response = await axios.post(`${apiUrl}/votes`, values, {
        headers: {
          'api-token-key': apiKey,
        },
      });

      setMessages(['Voto registrado con éxito']);
      setMessageType('success');
      onNewVote(response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        let messages = [];

        if (errors.document) {
          messages.push(...errors.document);
        }
        if (errors.candidate) {
          messages.push(...errors.candidate);
        }
        if (errors.error) {
          messages.push(errors.error);
        }
        if (!errors.document && !errors.candidate && !errors.error) {
          messages.push('Ocurrió un error inesperado.');
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
      {loading && <Loader />}
      <div className={`size-3/4 transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Formik
          initialValues={{ document: '', candidate: '' }}
          validationSchema={validationSchema}
          onSubmit={handleVote}
        >
          {({ isSubmitting }) => (
            <Form className="w-full bg-white p-20 rounded-xl shadow-sm hover:shadow-lg transition-all duration-1000 ease-in-out">
              <div className="w-full flex flex-col">
                <h1 className="mb-4 text-sm font-extrabold leading-none tracking-tight xs:text-md sm:text-lg md:text-2xl lg:text-4xl text-blue-500">
                  <AnimatedTitle text="Votá tu candidato" />
                </h1>
                <p className="mb-6 text-lg font-normal text-gray-500">Ingrese su número de documento y seleccione el candidato al que desea votar</p>
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <Field
                  type="text"
                  name="document"
                  id="document"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label htmlFor="document" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Documento</label>
                <ValidationErrorMessage name="document" />
              </div>
              <div className="relative z-0 w-full mb-6 group">
                <Field
                  as="select"
                  name="candidate"
                  id="candidate"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                >
                  <option value="" className="text-gray-500">Seleccione un candidato</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id} className="text-black">{c.name}</option>
                  ))}
                </Field>
                <label htmlFor="candidate" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Candidato</label>
                <ValidationErrorMessage name="candidate" />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                disabled={isSubmitting || submitting}
              >
                {isSubmitting || submitting ? <ButtonLoader /> : 'Votar'}
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
    </>
  );
}

export default VoterForm;