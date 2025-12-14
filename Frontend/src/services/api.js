import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const fetchTransactions = async (params) => {
  try {
    const response = await API.get('/transactions', { params });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    // Return null to allow frontend to handle empty state gracefully
    return null; 
  }
};

export const fetchFilterOptions = async () => {
  try {
    const response = await API.get('/transactions/options');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch filter options", error);
    return {};
  }
};