import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Customer/Home/Home';
import Products from './pages/Customer/Products/Products';
import ProductDetail from './pages/Customer/ProductDetails/ProductDetails.jsx';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgetPassword from './pages/Auth/ForgetPassword.jsx'
import ResetPassword from './pages/Auth/ResetPassword.jsx'
import EmailVerify from './pages/Auth/EmailVerify.jsx'
import AdminDashBoard from './pages/Admin/DashBoard/DashBoard.jsx';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import AdminProducts from './pages/Admin/Products/Products.jsx';
import Users from './pages/Admin/Users/Users.jsx';
import Cart from './pages/Customer/Cart/Cart.jsx';
import Checkout from './pages/Customer/Checkout/Checkout.jsx';
import Profile from './pages/Customer/Profile/Profile.jsx';
import OrdersManagement from './pages/Admin/Orders/Orders.jsx';
import GeneralInformation from './pages/Customer/About/GeneralInformation.jsx';
import PaymentSuccess from './pages/Customer/Checkout/PaymentSuccess.jsx';
import PaymentFailed from './pages/Customer/Checkout/PaymentFailed.jsx/index.js';

function AppContent() {
  const location = useLocation();
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleTokenChange = () => {
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('token-changed', handleTokenChange);
    window.addEventListener('storage', handleTokenChange);

    return () => {
      window.removeEventListener('token-changed', handleTokenChange);
      window.removeEventListener('storage', handleTokenChange);
    };
  }, []);

  return (
    <>
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
          path="/products/:slug"
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
          path="/cart"
          element={
            <CustomerLayout>
              <Cart />
            </CustomerLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <CustomerLayout>
              <Checkout />
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
        <Route
          path="/forget-password"
          element={
            <CustomerLayout>
              <ForgetPassword />
            </CustomerLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <CustomerLayout>
              <ResetPassword />
            </CustomerLayout>
          }
        />
        <Route
          path="/email-verify"
          element={
            <CustomerLayout>
              <EmailVerify />
            </CustomerLayout>
          }
        />
        <Route
          path="/profile/*"
          element={
            <CustomerLayout>
              <Profile />
            </CustomerLayout>
          }
        />

        <Route
          path="/links/*"
          element={
            <CustomerLayout>
              <GeneralInformation />
            </CustomerLayout>
          }
        />

        <Route
          path="/payment-success"
          element={
            <CustomerLayout>
              <PaymentSuccess />
            </CustomerLayout>
          }
        />

        <Route
          path="/payment-failed"
          element={
            <CustomerLayout>
              <PaymentFailed />
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
                  <Route path="users" element={<Users />} />
                  <Route path='orders' element={<OrdersManagement/>}/>
                </Routes>
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}