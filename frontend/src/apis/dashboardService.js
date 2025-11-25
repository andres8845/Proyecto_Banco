// src/apis/dashboardService.js
import api from './axiosInstance';

const dashboardService = {
  // Obtener estadísticas del dashboard
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Obtener análisis financiero
  getAnalytics: async (period = 'month') => {
    const response = await api.get(`/dashboard/analytics?period=${period}`);
    return response.data;
  },

  // Obtener resumen completo
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  }
};

export default dashboardService;
