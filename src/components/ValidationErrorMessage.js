import React from 'react';
import { ErrorMessage, useField } from 'formik';
import { motion } from 'framer-motion';

const ValidationErrorMessage = ({ name }) => {
  const [, meta] = useField(name);
  return (
    <ErrorMessage name={name}>
      {msg =>
        meta.touched && meta.error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-red-500 text-sm mt-1 text-left"
          >
            {msg}
          </motion.div>
        ) : null
      }
    </ErrorMessage>
  );
};

export default ValidationErrorMessage;