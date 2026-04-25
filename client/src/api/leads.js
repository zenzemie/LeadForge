import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getLeads = () => api.get('/leads');
export const getLead = (id) => api.get(`/leads/${id}`);
export const createLead = (leadData) => api.post('/leads', leadData);
export const updateLead = (id, leadData) => api.patch(`/leads/${id}`, leadData);
export const deleteLead = (id) => api.delete(`/leads/${id}`);

export default api;
