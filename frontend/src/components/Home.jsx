import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  // Featured products data with IDs matching your database
  const featuredProducts = [
    {
      id: "67f8c7b79e3ab1a4ee56ff0a", // Replace with actual product ID from database
      image: "/image/flower3.jpg",
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
      id: "67f8c5979e3ab1a4ee56fef0", // Replace with actual product ID from database
      image: "/image/bag2.jpg",
      title: "Stylish Bags",
      description: "Beautiful and practical crochet bags",
      category: "Bags"
    },
    {
      id: "67f8c6a69e3ab1a4ee56fefe", // Replace with actual product ID from database
      image: "/image/toy.jpg",
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
        <div className="featured-products-grid">
          {featuredProducts.map((product, index) => (
            <div 
              className="featured-product-card" 
              key={product.id}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="featured-product-image">
                <img src={product.image} alt={product.title} />
              </div>
              <div className="featured-product-content">
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