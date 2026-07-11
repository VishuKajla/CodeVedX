import { useParams } from 'react-router-dom';
import { products } from '../data.js';
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, showToast } = useContext(CartContext);
  const [selectedSize, setSelectedSize] = useState('');
  
  const product = products.find(p => p.id === parseInt(id));

  if (!product) return <h2>Product not found!</h2>;

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      showToast("Please select a size first!");
      return;
    }
    addToCart(product, selectedSize);
  };

  return (
    <div className="product-details">
      <img src={product.image} alt={product.name} />
      <div className="info">
        <h2>{product.name}</h2>
        <p className="brand">By {product.brand}</p>
        <p className="price">${product.price}</p>
        
        {/* Render Size Selector if product has sizes */}
        {product.sizes && (
          <div className="size-selector">
            <h4>Select Size:</h4>
            <div className="sizes-list">
              {product.sizes.map(size => (
                <button 
                  key={size} 
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="description">High-quality material perfect for daily wear. Easy returns available.</p>
        
        <button onClick={handleAddToCart} className="btn-add large">
          Add to Cart
        </button>
      </div>
    </div>
  );
}