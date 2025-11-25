// src/apis/accountService.js
import api from './axiosInstance';

const accountService = {
  // Obtener todas las cuentas del usuario
  getAllAccounts: async () => {
    const response = await api.get('/accounts');
    return response.data;
  },

  // Obtener una cuenta por número
  getAccountByNumber: async (numeroCuenta) => {
    const response = await api.get(`/accounts/${numeroCuenta}`);
    return response.data;
  },

  // Obtener una cuenta por ID
  getAccountById: async (idCuenta) => {
    const response = await api.get(`/accounts/id/${idCuenta}`);
    return response.data;
  },

  // Crear una nueva cuenta
  createAccount: async (accountData) => {
    const response = await api.post('/accounts', accountData);
    return response.data;
  },

  // Obtener estadísticas de cuentas
  getAccountsStats: async () => {
    const response = await api.get('/accounts/stats');
    return response.data;
  }
};

export default accountService;
