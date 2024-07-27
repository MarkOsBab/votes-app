import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './Loader';
import ButtonLoader from './ButtonLoader';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function VoterForm() {
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
          }
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
      await axios.post(`${apiUrl}/votes`, values, {
        headers: {
          'api-token-key': apiKey,
        }
      });

      setMessages(['Voto registrado con éxito']);
      setMessageType('success');
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
      <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <Formik
          initialValues={{ document: '', candidate: '' }}
          validationSchema={validationSchema}
          onSubmit={handleVote}
        >
          {({ isSubmitting }) => (
            <Form className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
              <div className="mb-6">
                <label htmlFor="document" className="block text-gray-700 text-left text-lg">Documento:</label>
                <Field
                  type="text"
                  name="document"
                  id="document"
                  className="w-full px-4 py-3 border rounded text-lg"
                  placeholder="Ingresa el documento para votar"
                />
                <ErrorMessage name="document" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-6">
                <label htmlFor="candidate" className="block text-gray-700 text-left text-lg">Candidato:</label>
                <Field
                  as="select"
                  name="candidate"
                  id="candidate"
                  className="w-full px-4 py-3 border rounded text-lg"
                >
                  <option value="">Seleccione un candidato</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="candidate" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-700 flex justify-center items-center text-lg"
                disabled={isSubmitting || submitting}
              >
                {isSubmitting || submitting ? <ButtonLoader /> : 'Votar'}
              </button>
              <ul className={`max-w-md space-y-2 list-disc list-inside text-left py-4 ${messageType === 'success' ? 'text-green-700' : 'text-red-700'}`}>
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