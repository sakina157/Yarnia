import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './components/styles/responsive.css';  // Add responsive styles
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
import AdminPanel from './components/admin/AdminPanel';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import SearchModal from './components/SearchModal';
import ProductDetail from './components/ProductDetail';
import Checkout from './components/Checkout';
import OrderHistory from './components/OrderHistory';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('Response error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <CartProvider>
            <div className="App">
              <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/settings" element={<UserProfile />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/product/:id" element={<ProductDetail />} />
              </Routes>
              <SearchModal />
              <Footer />
            </div>
          </CartProvider>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
