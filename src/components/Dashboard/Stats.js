import React from "react";

function Stats({ title, icon: Icon, borderClass, borderClassHover, quantity, onClick }) {
  return (
    <button
        className={`flex h-20 w-30 flex-col items-center justify-center rounded-md border border-2 ${borderClass} transition-colors duration-400 ease-in-out ${borderClassHover} cursor-pointer`}
        onClick={onClick}>
        <div className="flex flex-row items-center justify-center">
            <Icon className="h-6 w-6 fill-gray-500/95" />
            <span className="font-bold text-gray-600"> {quantity} </span>
        </div>
        <div className="mt-2 text-sm text-gray-400">{title}</div>
    </button>
  );
}

export default Stats;