import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data.js';

export default function ProductList() {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // New Category State
  const [sortOrder, setSortOrder] = useState('');

  // Dynamically extract unique brands and categories
  const uniqueBrands = [...new Set(products.map(p => p.brand))];
  const uniqueCategories = [...new Set(products.map(p => p.category))];

  const redirectToDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const displayedProducts = useMemo(() => {
    let filtered = products;

    // Filter by Brand
    if (selectedBrand !== '') {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    // Filter by Category
    if (selectedCategory !== '') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Sort by Price
    if (sortOrder === 'low-to-high') {
      return [...filtered].sort((a, b) => a.price - b.price); 
    }
    if (sortOrder === 'high-to-low') {
      return [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [selectedBrand, selectedCategory, sortOrder]);

  return (
    <div className="shop-layout">
      <aside className="sidebar">
        {/* Sort By Price Dropdown */}
        <div className="filter-group">
          <h3>Sort by Price</h3>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="">Recommended</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
          </select>
        </div>

        {/* Filter By Category Dropdown */}
        <div className="filter-group">
          <h3>Filter by Category</h3>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="sort-select"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Filter By Brand Dropdown */}
        <div className="filter-group">
          <h3>Filter by Brand</h3>
          <select 
            value={selectedBrand} 
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="sort-select"
          >
            <option value="">All Brands</option>
            {uniqueBrands.map(brand => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      </aside>

      <div className="product-grid">
        {displayedProducts.length === 0 ? (
          <h2 className="empty-state">No products match your filters.</h2>
        ) : (
          displayedProducts.map(product => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="card-link-wrapper">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="brand">{product.brand}</p>
                <p className="price">${product.price}</p>
              </Link>
              
              <div className="card-actions">
                <button onClick={() => redirectToDetails(product.id)} className="btn-add">
                  Add to Cart
                </button>
                <button onClick={() => redirectToDetails(product.id)} className="btn-buy">
                  Buy
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}