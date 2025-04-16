import React from "react";
import { useState } from "react";
import { Home, User, ShoppingCart, Lock } from "lucide-react";
import { Link } from 'react-router-dom';
import { react } from '@vitejs/plugin-react-swc';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("profile");

  const menuItems = [
    {
      label: "Thông tin cá nhân",
      icon: <Home size={16} />,
      onClick: () => setActiveTab("profile"),
    },
    {
      label: "Đơn hàng của tôi",
      onClick: () => setActiveTab("orders"),
    },
    {
      label: "Địa chỉ nhận hàng",
      onClick: () => setActiveTab("addresses"),
    },
    {
      label: "Thay đổi mật khẩu",
      onClick: () => setActiveTab("changePassword"),
    },
  ];

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