import React, { useEffect } from 'react';
import { FaShieldAlt, FaHandshake, FaCreditCard, FaTruck, FaPencilAlt } from 'react-icons/fa';
import './styles/Terms.css';

const Terms = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.terms-section').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="terms-container">
      <div className="terms-header">
        <h1>Terms & Conditions</h1>
        <p>Please read these terms carefully before placing an order</p>
        <div className="decorative-line"></div>
      </div>

      <div className="terms-content">
        <section className="terms-section">
          <div className="section-icon">
            <FaShieldAlt />
          </div>
          <h2>Order & Cancellation Policy</h2>
          <ul>
            <li>Orders cannot be cancelled after 3 days of placing the order</li>
            <li>Customization orders, once confirmed, cannot be cancelled</li>
            <li>Payment must be made in full at the time of ordering</li>
            <li>Order confirmation will be sent via email</li>
          </ul>
        </section>

        <section className="terms-section">
          <div className="section-icon">
            <FaTruck />
          </div>
          <h2>Shipping & Returns</h2>
          <ul>
            <li>No return policy available for hygiene and personal care reasons</li>
            <li>Shipping typically takes 5-7 business days</li>
            <li>Shipping available all over India</li>
            <li>Shipping costs are non-refundable</li>
          </ul>
        </section>

        <section className="terms-section">
          <div className="section-icon">
            <FaPencilAlt />
          </div>
          <h2>Customization Terms</h2>
          <ul>
            <li>Custom orders may take 2-3 weeks for completion</li>
            <li>Design approval required before production begins</li>
            <li>Additional charges apply for custom designs</li>
            <li>Size and color variations may occur slightly</li>
          </ul>
        </section>

        <section className="terms-section">
          <div className="section-icon">
            <FaCreditCard />
          </div>
          <h2>Payment & Pricing</h2>
          <ul>
            <li>All prices are in USD unless otherwise stated</li>
            <li>Secure payment processing through trusted gateways</li>
            <li>Prices may change without prior notice</li>
            <li>Special discounts cannot be combined with other offers</li>
          </ul>
        </section>

        <section className="terms-section">
          <div className="section-icon">
            <FaHandshake />
          </div>
          <h2>Product Usage & Care</h2>
          <ul>
            <li>Hand wash recommended for all crochet items</li>
            <li>Keep products away from direct sunlight</li>
            <li>Follow provided care instructions for longevity</li>
            <li>Products are for personal use only</li>
          </ul>
        </section>
      </div>

      <div className="terms-footer">
        <div className="decorative-line"></div>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>For any queries, please contact our support team</p>
      </div>
    </div>
  );
};

export default Terms;