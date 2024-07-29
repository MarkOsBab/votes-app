import React, { useEffect, useState } from 'react';

const notificationTypes = {
  success: {
    icon: (
      <svg
        className="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
      </svg>
    ),
    bgColor: 'bg-green-100',
    textColor: 'text-green-500',
  },
  error: {
    icon: (
      <svg
        className="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
      </svg>
    ),
    bgColor: 'bg-red-100 dark:bg-red-500',
    textColor: 'text-red-200',
  },
  warning: {
    icon: (
      <svg
        className="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
      </svg>
    ),
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-500',
  },
};

function Notification({ type, message, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const { icon, bgColor, textColor } = notificationTypes[type] || notificationTypes.success;

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center transition-opacity transition-transform duration-300 ease-in-out ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div
        className={`flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow ${bgColor}`}
        role="alert"
      >
        <div
          className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${textColor}`}
        >
          {icon}
          <span className="sr-only">Icon</span>
        </div>
        <div className={`ml-3 text-sm font-normal m-1.5 ${textColor}`}>{message}</div>
        <button
          onClick={() => setShow(false)}
          type="button"
          className="focus:outline-none p-4 rounded-lg hover:bg-white-700 hover:text-white transition duration-300"
          aria-label="Close"
        >
          X
        </button>
      </div>
    </div>
  );
}

export default Notification;