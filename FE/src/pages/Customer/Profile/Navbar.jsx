// Navbar.jsx
import { useState } from 'react';
import { Home, ShoppingBag, User, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [activeItem, setActiveItem] = useState('home');

  const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: <Home size={20} />, path: '/' },
    { id: 'history', label: 'Lịch sử mua hàng', icon: <ShoppingBag size={20} />, path: '/orders' },
    { id: 'account', label: 'Tài khoản của bạn', icon: <User size={20} />, path: '/profile' },
    { id: 'support', label: 'Hỗ trợ', icon: <HelpCircle size={20} />, path: '/support' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full overflow-y-auto sticky top-0 left-0">
      {/* Logo */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-red-600 text-white rounded-md flex items-center justify-center mr-2">
            <span className="font-bold">CP</span>
          </div>
          <span className="font-bold text-red-600">cellphone</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="px-2 py-1">
              <Link
                to={item.path}
                onClick={() => setActiveItem(item.id)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                  activeItem === item.id
                    ? 'bg-red-100 text-red-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}