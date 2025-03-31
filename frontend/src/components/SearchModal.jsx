import React, { useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useSearch } from '../context/SearchContext';
import SearchResultItem from './SearchResultItem';
import './styles/SearchModal.css';

const SearchModal = () => {
    const {
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        recentSearches,
        searchResults,
        loading,
        selectedCategory,
        setSelectedCategory,
        performSearch,
        clearSearch
    } = useSearch();

    const searchInputRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        if (isSearchOpen) {
            searchInputRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isSearchOpen]);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim()) {
            performSearch(query);
        }
    };

    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const categories = ['All', 'Flowers', 'Keychain', 'Toys', 'Bags', 'Accessories'];

    if (!isSearchOpen) return null;

    return (
        <div className="search-overlay" onClick={handleClickOutside}>
            <div className="search-modal" ref={modalRef}>
                <div className="search-header">
                    <div className="search-input-container">
                        <FaSearch className="search-icon" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <button 
                            className="close-search"
                            onClick={() => {
                                setIsSearchOpen(false);
                                clearSearch();
                            }}
                        >
                            <FaTimes />
                        </button>
                    </div>
                    <div className="search-filters">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    if (searchQuery) performSearch(searchQuery);
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="search-content">
                    {loading ? (
                        <div className="search-loading">
                            <div className="loader"></div>
                            <p>Searching...</p>
                        </div>
                    ) : searchQuery ? (
                        Object.entries(searchResults.groupedResults).length > 0 ? (
                            Object.entries(searchResults.groupedResults).map(([category, products]) => (
                                <div key={category} className="search-category-group">
                                    <h3>{category}</h3>
                                    <div className="search-results">
                                        {products.map(product => (
                                            <SearchResultItem 
                                                key={product._id} 
                                                product={product}
                                                onClose={() => setIsSearchOpen(false)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                <p>No products found for "{searchQuery}"</p>
                                <p>Try different keywords or browse categories</p>
                            </div>
                        )
                    ) : (
                        <div className="search-suggestions">
                            {recentSearches.length > 0 && (
                                <div className="recent-searches">
                                    <h3>Recent Searches</h3>
                                    <div className="recent-search-items">
                                        {recentSearches.map((search, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setSearchQuery(search);
                                                    performSearch(search);
                                                }}
                                            >
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;