import HomePage from './pages/Home/Home.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from './pages/Products/Products.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import BreadCrumb from './components/Breadcrumb.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import ForgetPassword from './pages/Auth/ForgetPassword.jsx';
import ResetPassword from './pages/Auth/ResetPassword.jsx';
import EmailVerify from './pages/Auth/EmailVerify.jsx';

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
        <Route path='/forget-password' element={<ForgetPassword/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
      </Routes>
      <Footer />
    </Router>
  )
}