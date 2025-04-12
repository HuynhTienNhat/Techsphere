import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Customer/Home/Home";
import Products from "./pages/Customer/Products/Products";
import ProductDetail from "./pages/Customer/ProductDetails/Product_Details";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AdminDashBoard from "./pages/Admin/Dashboard/Dashboard";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import AdminProducts from './pages/Admin/Products/Products.jsx';
import Users from './pages/Admin/Users/Users.jsx';

function AppContent() {
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem("role"));

  // Lắng nghe sự kiện thay đổi token/role để cập nhật trạng thái
  useEffect(() => {
    const handleTokenChange = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("token-changed", handleTokenChange);
    window.addEventListener("storage", handleTokenChange);

    return () => {
      window.removeEventListener("token-changed", handleTokenChange);
      window.removeEventListener("storage", handleTokenChange);
    };
  }, []);

  return (
    <Routes>
      {/* Customer Routes */}
      <Route
        path="/"
        element={
          <CustomerLayout>
            <Home />
          </CustomerLayout>
        }
      />
      <Route
        path="/products"
        element={
          <CustomerLayout>
            <Products />
          </CustomerLayout>
        }
      />
      <Route
        path="/products/:id"
        element={
          <CustomerLayout>
            <ProductDetail />
          </CustomerLayout>
        }
      />
      <Route
        path="/login"
        element={
          <CustomerLayout>
            <Login />
          </CustomerLayout>
        }
      />
      <Route
        path="/register"
        element={
          <CustomerLayout>
            <Register />
          </CustomerLayout>
        }
      />
      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedAdminRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<AdminDashBoard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="users" element={<Users/>}/>
              </Routes>
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}