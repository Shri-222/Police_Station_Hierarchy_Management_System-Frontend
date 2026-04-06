import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
};

export const hierarchyService = {
  getHierarchy: async () => {
    const res = await apiClient.get('/data/hierarchy');
    return res.data;
  },

  createUnit: async (data) => {
    const res = await apiClient.post('/data/units', data);
    return res.data;
  },

  updateUnit: async (id, data) => {
    const res = await apiClient.put(`/data/units/${id}`, data);
    return res.data;
  },

  deleteUnit: async (id) => {
    const res = await apiClient.delete(`/data/units/${id}`);
    return res.data;
  }
};

export default apiClient;