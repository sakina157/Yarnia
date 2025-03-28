import React, { useState } from 'react';
import { FaShoppingCart, FaImage } from 'react-icons/fa';
import './styles/Shop.css';

const Shop = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  // Sample product data without images
  const products = [
    {
      id: 1,
      name: "Sunflower Bouquet",
      category: "Flowers",
      price: 29.99,
    },
    {
      id: 2,
      name: "Bunny Keychain",
      category: "Keychain",
      price: 12.99,
    },
    {
      id: 3,
      name: "Teddy Bear",
      category: "Toys",
      price: 34.99,
    },
    {
      id: 4,
      name: "Tote Bag",
      category: "Bags",
      price: 39.99,
    },
    {
      id: 5,
      name: "Rose Brooch",
      category: "Accessories",
      price: 19.99,
    },
  ];

  const filters = ['All', 'Flowers', 'Keychain', 'Toys', 'Bags', 'Accessories'];

  const filteredProducts = activeFilter === 'All' 
    ? products 
    : products.filter(product => product.category === activeFilter);

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Our Crochet Collection</h1>
        <p>Handmade with love, designed to bring joy</p>
      </div>

      <div className="filter-container">
        {filters.map(filter => (
          <button
            key={filter}
            className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-placeholder">
                <FaImage />
              </div>
              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">${product.price}</div>
                <button className="add-to-cart" aria-label="Add to cart">
                  <FaShoppingCart />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            No products found in this category
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop; 