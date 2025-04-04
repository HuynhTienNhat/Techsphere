import HomePage from './pages/Home/Home.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from './pages/Products/Products.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import BreadCrumb from './components/Breadcrumb.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';

export default function App(){
  return (
    <Router>
      <Header />
      <BreadCrumb />
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
      <Footer />
    </Router>
  )
}