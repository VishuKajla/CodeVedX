import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [cartTotal, setCartTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setCartTotal(total);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(count);
  }, [cartItems]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000); 
  };

  const addToCart = (product, size = null) => {
    // Generate a unique ID based on product ID and Size
    const cartItemId = size ? `${product.id}-${size}` : product.id;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevItems.map(item => 
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, size, cartItemId, quantity: 1 }];
    });
    
    const sizeText = size ? ` (Size: ${size})` : '';
    showToast(`Added ${product.name}${sizeText} to cart!`);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, amount) => {
    setCartItems((prevItems) => 
      prevItems
        .map(item => {
          if (item.cartItemId === cartItemId) {
            return { ...item, quantity: item.quantity + amount };
          }
          return item;
        })
        .filter(item => item.quantity > 0) 
    );
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, cartTotal, totalItems, toastMessage, showToast 
    }}>
      {children}
    </CartContext.Provider>
  );
};