import React from 'react';

const Placeholder = ({ columns }) => (
  <tr className="animate-pulse py-2 px-4 border-b border-gray-300 text-left">
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="py-2 px-4 border-b border-gray-300">
        <div className="h-6 bg-gray-300 rounded w-full"></div>
      </td>
    ))}
  </tr>
);

export default Placeholder;