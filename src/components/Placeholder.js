import React from 'react';

const Placeholder = ({ columns }) => (
  <tr className="animate-pulse">
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="py-2 px-4 border-b border-gray-300">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </td>
    ))}
  </tr>
);

export default Placeholder;