// src/apis/transactionService.js
import api from './axiosInstance';

const transactionService = {
  // Obtener todas las transacciones del usuario
  getAllTransactions: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },

  // Obtener transacciones recientes (últimas 10)
  getRecentTransactions: async () => {
    const response = await api.get('/transactions/recent');
    return response.data;
  },

  // Obtener transacciones por cuenta
  getTransactionsByAccount: async (numeroCuenta) => {
    const response = await api.get(`/transactions/by-account/${numeroCuenta}`);
    return response.data;
  },

  // Realizar una transferencia
  transfer: async (transferData) => {
    const response = await api.post('/transactions/transfer', transferData);
    return response.data;
  },

  // Realizar un depósito
  deposit: async (depositData) => {
    const response = await api.post('/transactions/deposit', depositData);
    return response.data;
  },

  // Realizar un retiro
  withdraw: async (withdrawData) => {
    const response = await api.post('/transactions/withdraw', withdrawData);
    return response.data;
  },

  // Obtener estadísticas de transacciones
  getTransactionStats: async () => {
    const response = await api.get('/transactions/stats');
    return response.data;
  }
};

export default transactionService;
