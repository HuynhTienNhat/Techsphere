import React from "react";
import { useState } from "react";
import { User, ShoppingCart, LocateIcon , Lock, HelpCircle } from "lucide-react";
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("profile");

  const menuItems = [
    {
      id: "profile",
      label: "Thông tin cá nhân",
      icon: <User size={20} />,
      onClick: () => setActiveItem("profile"),
      path : "/profile",
    },
    {
      id: "orders",
      label: "Đơn hàng của tôi",
      icon: <ShoppingCart size={20} />,
      onClick: () => setActiveItem("orders"),
      path : "/profile/orders",
    },
    {
      id: "addresses",
      label: "Địa chỉ nhận hàng",
      icon: <LocateIcon size={20} />,
      onClick: () => setActiveItem("addresses"),
      path : "/profile/addresses",
    },
    {
      id: "changePassword",
      label: "Thay đổi mật khẩu",
      icon: <Lock size={20} />,
      onClick: () => setActiveItem("changePassword"),
      path : "/profile/change-password",
    },
    {
      id: "support",
      label: "Hỗ trợ",
      icon: <HelpCircle size={20} />,
      onClick: () => setActiveItem("support"),
      path : "/profile/support",
    },
  ];

  return (
    <div className="w-64 bg-white shadow-md rounded-md p-2">
      {menuItems.map(item => (
        <Link
          key={item.id}
          to={item.path}
          onClick={() => setActiveItem(item.id)}
          className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
            activeItem === item.id 
              ? 'bg-violet-50 border-l-2 border-violet-500' 
              : 'hover:bg-gray-100'
          }`}
        >
          <span className={`mr-3 ${activeItem === item.id ? 'text-violet-500' : 'text-gray-500'}`}>
            {item.icon}
          </span>
          <span className={activeItem === item.id ? 'text-violet-500 font-medium' : 'text-gray-700'}>
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}