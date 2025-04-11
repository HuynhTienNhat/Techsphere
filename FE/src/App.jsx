import HomePage from './pages/Customer/Home/Home.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from './pages/Customer/Products/Products.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import BreadCrumb from './components/Breadcrumb.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute.jsx';
import AdminDashBoard from './pages/Admin/DashBoard/DashBoard.jsx';

export default function App(){
  return (
    <Router>
      <Header />
      <BreadCrumb />
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/admin' element={
          <ProtectedAdminRoute>
            <AdminDashBoard />
          </ProtectedAdminRoute>
        }/> 
      </Routes>
      <Footer />
    </Router>
  )
}