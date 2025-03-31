import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  // Featured products data with IDs matching your database
  const featuredProducts = [
    {
      id: "your-flower-product-id", // Replace with actual product ID from database
      image: "/images/crochet-flowers.jpg",
      title: "Delicate Flower Collection",
      description: "Handmade crochet flowers for any occasion",
      category: "Flowers"
    },
    {
      id: "67ea4ba20e0431c1dbb7042e", 
      image: "/image/honey2.jpg",
      title: "Cute Keychains",
      description: "Adorable accessories for your keys",
      category: "Keychain"
    },
    {
      id: "your-bag-product-id", // Replace with actual product ID from database
      image: "/images/crochet-bag.jpg",
      title: "Stylish Bags",
      description: "Beautiful and practical crochet bags",
      category: "Bags"
    },
    {
      id: "your-toys-product-id", // Replace with actual product ID from database
      image: "/images/crochet-toys.jpg",
      title: "Adorable Toys",
      description: "Handmade with love for little ones",
      category: "Toys"
    }
  ];

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

  const handleViewDetails = (productId, category) => {
    navigate(`/product/${productId}`);
  };

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
          {featuredProducts.map((product, index) => (
            <div 
              className="product-card" 
              key={product.id}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="product-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="product-content">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <button 
                  className="view-details-btn"
                  onClick={() => handleViewDetails(product.id, product.category)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="why-choose-us">
        <h2>Why Choose Yarnia?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧶</div>
            <h3>Handmade with Love</h3>
            <p>Each piece is crafted with care and attention to detail</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Custom Orders</h3>
            <p>Get your items personalized in your favorite colors</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎀</div>
            <h3>Premium Quality</h3>
            <p>Made with the finest materials for lasting beauty</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎁</div>
            <h3>Perfect Gifts</h3>
            <p>Unique handmade items that bring joy to loved ones</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 