import { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);

  if (cartItems.length === 0) return <h2 className="empty-state">Your cart is empty.</h2>;

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.cartItemId} className="cart-item">
            <img src={item.image} alt={item.name} />
            
            <div className="item-details">
              <h4>{item.name}</h4>
              <p>
                ${item.price} 
                {item.size && <span className="item-size"> | Size: {item.size}</span>}
              </p>
            </div>

            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item.cartItemId, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.cartItemId, 1)}>+</button>
            </div>

            <p className="item-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
            
            <button onClick={() => removeFromCart(item.cartItemId)} className="btn-remove">
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: ${cartTotal.toFixed(2)}</h3>
        <button className="btn-checkout">Proceed to Checkout</button>
      </div>
    </div>
  );
}