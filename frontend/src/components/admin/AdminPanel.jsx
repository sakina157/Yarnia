import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
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
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        // Append all form data
        Object.keys(formData).forEach(key => {
            if (key === 'images') {
                for (let i = 0; i < formData.images.length; i++) {
                    formDataToSend.append('images', formData.images[i]);
                }
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (response.ok) {
                setIsAddModalOpen(false);
                setFormData({
                    title: '',
                    description: '',
                    price: '',
                    category: 'Keychain',
                    stock: '',
                    images: []
                });
                fetchProducts();
            }
        } catch (error) {
            console.error('Error adding product:', error);
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
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            
            // Append text fields
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('stock', formData.stock);

            // Append new images if any
            if (formData.images instanceof FileList) {
                for (let i = 0; i < formData.images.length; i++) {
                    formDataToSend.append('images', formData.images[i]);
                }
            }

            const response = await fetch(`/api/products/${editingProductId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (response.ok) {
                const updatedProduct = await response.json();
                setProducts(products.map(p => 
                    p._id === editingProductId ? updatedProduct : p
                ));
                setIsAddModalOpen(false);
                setIsEditing(false);
                setEditingProductId(null);
                alert('Product updated successfully');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Error updating product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product');
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    // Remove product from state
                    setProducts(products.filter(product => product._id !== productId));
                    alert('Product deleted successfully');
                } else {
                    alert('Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product');
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
                            {product.images[0] ? (
                                <img src={product.images[0]} alt={product.title} />
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