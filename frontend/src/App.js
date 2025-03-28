import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Shop from './components/Shop';
import Cart from './components/Cart.jsx';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { AuthProvider } from './context/AuthContext';
import UserProfile from './components/UserProfile';
import Terms from './components/Term';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
                <div className="App">
                    
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/terms" element={<Terms />} />
        
        </Routes>
        <Footer />
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
