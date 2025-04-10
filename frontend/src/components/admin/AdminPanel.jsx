import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { api } from '../../services/api';
import './styles/AdminPanel.css';

const AdminPanel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Keychain',
        stock: '',
        images: []
    });

    useEffect(() => {
        // Check if user is admin
        if (!user || user.email !== process.env.REACT_APP_ADMIN_EMAIL) {
            navigate('/');
            return;
        }
        fetchProducts();
    }, [user, navigate]);

    const fetchProducts = async () => {
        try {
            const data = await api.get('/api/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            
            // Append all form data
            Object.keys(formData).forEach(key => {
                if (key === 'images') {
                    // Handle FileList or File objects
                    const files = formData.images;
                    for (let i = 0; i < files.length; i++) {
                        formDataToSend.append('images', files[i]);
                    }
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await api.post('/api/products', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // The response is the created product object
            setProducts([...products, response]);
            setIsAddModalOpen(false);
            setFormData({
                title: '',
                description: '',
                price: '',
                category: 'Keychain',
                stock: '',
                images: []
            });
            alert('Product added successfully!');
            fetchProducts(); // Refresh the products list
        } catch (error) {
            console.error('Error adding product:', error);
            alert(error.response?.data?.message || 'Error adding product. Please try again.');
        }
    };

    const handleEdit = async (productId) => {
        try {
            const productToEdit = products.find(p => p._id === productId);
            if (productToEdit) {
                setFormData({
                    title: productToEdit.title,
                    description: productToEdit.description,
                    price: productToEdit.price,
                    category: productToEdit.category,
                    stock: productToEdit.stock,
                    images: []
                });
                setEditingProductId(productId);
                setIsEditing(true);
                setIsAddModalOpen(true);
            }
        } catch (error) {
            console.error('Error editing product:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            
            // Append text fields
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('stock', formData.stock);

            // Append new images if any
            if (formData.images && formData.images.length > 0) {
                for (let i = 0; i < formData.images.length; i++) {
                    formDataToSend.append('images', formData.images[i]);
                }
            }

            const updatedProduct = await api.put(`/api/products/${editingProductId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update the products list with the updated product
            setProducts(products.map(p => 
                p._id === editingProductId ? updatedProduct : p
            ));
            setIsAddModalOpen(false);
            setIsEditing(false);
            setEditingProductId(null);
            setFormData({
                title: '',
                description: '',
                price: '',
                category: 'Keychain',
                stock: '',
                images: []
            });
            alert('Product updated successfully');
            fetchProducts(); // Refresh the list to get updated data
        } catch (error) {
            console.error('Error updating product:', error);
            alert(error.response?.data?.message || 'Error updating product');
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/api/products/${productId}`);
                // If we reach here, deletion was successful
                setProducts(products.filter(product => product._id !== productId));
                alert('Product deleted successfully');
            } catch (error) {
                console.error('Error deleting product:', error);
                alert(error.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1>Admin Panel</h1>
                <button 
                    className="add-product-btn"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <FaPlus /> Add New Product
                </button>
            </div>

            {/* Product List */}
            <div className="products-list">
                {products.map(product => (
                    <div key={product._id} className="product-item">
                        <div className="product-image">
                            {product.images && product.images[0] ? (
                                <img 
                                    src={product.images[0].startsWith('http') 
                                        ? product.images[0] 
                                        : `${process.env.REACT_APP_API_URL}${product.images[0]}`
                                    } 
                                    alt={product.title}
                                />
                            ) : (
                                <FaImage className="placeholder-image" />
                            )}
                        </div>
                        <div className="product-details">
                            <h3>{product.title}</h3>
                            <p className="price">₹{product.price}</p>
                            <p className="category">{product.category}</p>
                            <p className="stock">Stock: {product.stock}</p>
                        </div>
                        <div className="product-actions">
                            <button 
                                className="edit-btn" 
                                onClick={() => handleEdit(product._id)}
                            >
                                <FaEdit />
                            </button>
                            <button 
                                className="delete-btn"
                                onClick={() => handleDelete(product._id)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    required
                                >
                                    <option value="Flowers">Flowers</option>
                                    <option value="Keychain">Keychain</option>
                                    <option value="Toys">Toys</option>
                                    <option value="Bags">Bags</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    required
                                    placeholder="Enter price in INR"
                                />
                            </div>
                            <div className="form-group">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Images</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setFormData({...formData, images: e.target.files})}
                                    required={!isEditing}
                                />
                                {isEditing && (
                                    <small className="help-text">
                                        Only upload new images if you want to replace the existing ones
                                    </small>
                                )}
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="submit-btn">
                                    {isEditing ? 'Save Changes' : 'Add Product'}
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setIsEditing(false);
                                        setEditingProductId(null);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel; 