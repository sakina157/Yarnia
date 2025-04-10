import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [searchResults, setSearchResults] = useState({ results: [], groupedResults: {} });
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Debounce search to prevent too many API calls
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    // Save recent searches to localStorage
    const addToRecentSearches = useCallback((query) => {
        setRecentSearches(prev => {
            const filtered = prev.filter(item => item !== query);
            const newSearches = [query, ...filtered].slice(0, 5);
            localStorage.setItem('recentSearches', JSON.stringify(newSearches));
            return newSearches;
        });
    }, []);

    // Load recent searches from localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    const performSearch = debounce(async (query) => {
        if (!query.trim()) {
            setSearchResults({ results: [], groupedResults: {} });
            return;
        }

        try {
            setLoading(true);
            const params = new URLSearchParams({
                q: query,
                category: selectedCategory
            });

            const data = await api.get(`/api/products/search?${params}`);
            setSearchResults(data);
            
            if (query.trim()) {
                addToRecentSearches(query);
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to search products');
        } finally {
            setLoading(false);
        }
    }, 300);

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults({ results: [], groupedResults: {} });
    };

    return (
        <SearchContext.Provider value={{
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
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext); 