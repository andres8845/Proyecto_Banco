// src/apis/paymentService.js
import api from './axiosInstance';

const paymentService = {
  // Procesar un pago
  processPayment: async (paymentData) => {
    const response = await api.post('/payments/process', paymentData);
    return response.data;
  },

  // Obtener historial de pagos
  getPaymentHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data;
  },

  // Obtener categorías de pago disponibles
  getPaymentCategories: async () => {
    const response = await api.get('/payments/categories');
    return response.data;
  }
};

export default paymentService;
