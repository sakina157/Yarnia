import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 30000, // 30 seconds timeout
});

// Add request interceptor to handle auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const api = {
    get: async (endpoint) => {
        try {
            const response = await axiosInstance.get(endpoint);
            return response.data;
        } catch (error) {
            console.error('API GET Error:', error.response?.data || error.message);
            throw error;
        }
    },
    post: async (endpoint, data, config = {}) => {
        try {
            // If data is FormData, the content type will be set automatically
            const response = await axiosInstance.post(endpoint, data, config);
            return response.data;
        } catch (error) {
            console.error('API POST Error:', error.response?.data || error.message);
            throw error;
        }
    },
    put: async (endpoint, data, config = {}) => {
        try {
            const response = await axiosInstance.put(endpoint, data, config);
            return response.data;
        } catch (error) {
            console.error('API PUT Error:', error.response?.data || error.message);
            throw error;
        }
    },
    delete: async (endpoint) => {
        try {
            const response = await axiosInstance.delete(endpoint);
            return response.data;
        } catch (error) {
            console.error('API DELETE Error:', error.response?.data || error.message);
            throw error;
        }
    }
};