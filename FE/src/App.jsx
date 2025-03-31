import HomePage from './pages/Home/Home.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from './pages/Products/Products.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
export default function App(){
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/products' element={<Products/>}/>
      </Routes>
      <Footer />
    </Router>
  )
}