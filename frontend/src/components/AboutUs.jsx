import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaHeart, FaGem, FaMagic, FaYarn, FaStar, FaLeaf } from 'react-icons/fa';
import './styles/AboutUs.css';

const AboutUs = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const floatingIcons = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="about-us">
      <div className="parallax-container">
        <motion.div 
          className="parallax-image"
          style={{ y }}
        />
        <div className="parallax-content">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="about-hero-content"
          >
            <h1>Our Story</h1>
            <p>Crafting Dreams, One Stitch at a Time</p>
          </motion.div>
        </div>
      </div>

      <section className="our-journey">
        <motion.div 
          {...fadeInUp}
          className="journey-content"
        >
          <motion.div
            animate="animate"
            variants={floatingIcons}
            className="floating-yarn-icon"
          >
            <FaYarn />
          </motion.div>
          <h2>The Yarnia Journey</h2>
          <p>Welcome to Yarnia, where every piece tells a story of passion, creativity, and dedication. Our journey began with a simple love for crochet and a dream to create beautiful, handcrafted pieces that bring joy to people's lives.</p>
          
          <div className="founder-section">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src="/images/founder.jpg" alt="Founder" className="founder-image" />
            </motion.div>
            <motion.div 
              {...fadeInUp}
              className="founder-text"
            >
              <h3>Our Founder's Vision</h3>
              <p>Starting as a hobby during quiet evenings, my passion for crochet grew into something more meaningful. Each stitch became a way to weave love, care, and artistry into creating pieces that would become part of people's cherished memories.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="our-values">
        <motion.h2 {...fadeInUp}>What Makes Us Special</motion.h2>
        <div className="values-grid">
          <motion.div 
            className="value-card"
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div animate="animate" variants={floatingIcons}>
              <FaHeart className="value-icon" />
            </motion.div>
            <h3>Made with Love</h3>
            <p>Every piece is crafted with attention to detail and genuine care, ensuring each creation is unique and special.</p>
          </motion.div>

          <motion.div 
            className="value-card"
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div animate="animate" variants={floatingIcons}>
              <FaGem className="value-icon" />
            </motion.div>
            <h3>Quality Materials</h3>
            <p>We use only the finest yarns and materials to create durable, beautiful pieces that last.</p>
          </motion.div>

          <motion.div 
            className="value-card"
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div animate="animate" variants={floatingIcons}>
              <FaMagic className="value-icon" />
            </motion.div>
            <h3>Custom Creations</h3>
            <p>We love bringing your ideas to life through personalized, custom-made pieces.</p>
          </motion.div>
        </div>
      </section>

      <section className="creation-process">
        <motion.h2 {...fadeInUp}>Our Creation Process</motion.h2>
        <div className="process-timeline">
          {[
            { number: 1, title: "Design & Planning", icon: <FaStar />, delay: 0 },
            { number: 2, title: "Material Selection", icon: <FaYarn />, delay: 0.2 },
            { number: 3, title: "Crafting", icon: <FaHeart />, delay: 0.4 },
            { number: 4, title: "Quality Check", icon: <FaGem />, delay: 0.6 }
          ].map((step, index) => (
            <motion.div 
              key={step.number}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: step.delay }}
              whileHover={{ scale: 1.05 }}
              className="process-step"
            >
              <motion.div 
                className="step-number"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {step.icon}
              </motion.div>
              <h3>{step.title}</h3>
              <p>Every piece begins with careful planning and creative design.</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="join-journey">
        <motion.div 
          className="join-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <h2>Be Part of Our Story</h2>
          </motion.div>
          <p>Join us in creating beautiful memories with handcrafted crochet pieces.</p>
          <motion.button 
            className="shop-now-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Explore Our Collection
          </motion.button>
        </motion.div>
      </section>

      <div className="decorative-elements">
        <motion.div 
          className="floating-element elem1"
          animate={{ y: [0, -20, 0], rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FaYarn />
        </motion.div>
        <motion.div 
          className="floating-element elem2"
          animate={{ y: [0, 20, 0], rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <FaLeaf />
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs; 