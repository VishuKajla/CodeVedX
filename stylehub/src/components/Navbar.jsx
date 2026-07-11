import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

export default function Navbar() {
  const { totalItems } = useContext(CartContext);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">StyleHub</Link>
      <Link to="/cart" className="cart-link">
        Go to Cart
        {/* Only show the badge if there are items in the cart */}
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </Link>
    </nav>
  );
}