import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import { Routes, Route, Router } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/Home/Home.jsx'
import Products from './pages/Products/Products.jsx'
export default function App(){
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<HomePage />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path='/products' element={<Products/>}/>
    </Routes>
    <Footer />
  </BrowserRouter>
  )
}