import React from "react";

export default function Sidebar({ menuItems = [] }) {
  return (
    <ul className="bg-white w-60 shadow-sm rounded-md">
      {menuItems.map((item, index) => (
        <li 
          key={index} 
          className="hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          onClick={item.onClick}
        >
          <div className="py-3 px-4">
            {item.label}
          </div>
        </li>
      ))}
    </ul>
  );
}