import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/Home.css';

const Home = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.featured-products, .product-card');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Yarnia</h1>
          <p>Discover handcrafted crochet treasures made with love</p>
          <Link to="/shop" className="shop-now-btn">
            Shop Now
          </Link>
        </div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="scroll-arrow">↓</div>
      </section>

      <section className="featured-products">
        <h2>Featured Creations</h2>
        <div className="products-grid">
          <div className="product-card">
            <div className="product-image">
              <img src="/images/crochet-flowers.jpg" alt="Crochet Flowers" />
            </div>
            <h3>Delicate Flower Collection</h3>
            <p>Handmade crochet flowers for any occasion</p>
            <button className="view-details-btn">View Details</button>
          </div>
          
          <div className="product-card">
            <div className="product-image">
              <img src="/images/crochet-keychain.jpg" alt="Crochet Keychain" />
            </div>
            <h3>Cute Keychains</h3>
            <p>Adorable accessories for your keys</p>
            <button className="view-details-btn">View Details</button>
          </div>
          
          <div className="product-card">
            <div className="product-image">
              <img src="/images/crochet-bag.jpg" alt="Crochet Bag" />
            </div>
            <h3>Stylish Bags</h3>
            <p>Beautiful and practical crochet bags</p>
            <button className="view-details-btn">View Details</button>
          </div>
          
          <div className="product-card">
            <div className="product-image">
              <img src="/images/crochet-toys.jpg" alt="Crochet Toys" />
            </div>
            <h3>Adorable Toys</h3>
            <p>Handmade with love for little ones</p>
            <button className="view-details-btn">View Details</button>
          </div>
        </div>
      </section>

      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          <div className="category-card flowers">
            <h3>Flowers</h3>
          </div>
          <div className="category-card accessories">
            <h3>Accessories</h3>
          </div>
          <div className="category-card bags">
            <h3>Bags</h3>
          </div>
          <div className="category-card toys">
            <h3>Toys</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 