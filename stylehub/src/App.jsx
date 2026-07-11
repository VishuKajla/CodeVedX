import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import ProductList from './components/ProductList.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import Cart from './components/Cart.jsx';
import Navbar from './components/Navbar.jsx';
import Toast from './components/Toast.jsx';
import './style.css';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Toast />
        <main className="container">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
      </Router>
    </CartProvider>
  );
}