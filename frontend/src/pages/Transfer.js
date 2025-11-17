import React, { useState, useEffect } from 'react';
import api from '../apis/axiosInstance';
import Navbar from '../components/Navbar';
import './Transfer.css';

const Transfer = () => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    cuenta_origen: '',
    cuenta_destino: '',
    monto: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data.accounts || []);
    } catch (error) {
      console.error('Error obteniendo cuentas:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!formData.cuenta_origen || !formData.cuenta_destino) {
      setMessage({ type: 'error', text: 'Debes seleccionar ambas cuentas' });
      return;
    }

    if (formData.cuenta_origen === formData.cuenta_destino) {
      setMessage({ type: 'error', text: 'No puedes transferir a la misma cuenta' });
      return;
    }

    if (parseFloat(formData.monto) <= 0) {
      setMessage({ type: 'error', text: 'El monto debe ser mayor a 0' });
      return;
    }

    setLoading(true);

    try {
      await api.post('/transactions/transfer', {
        ...formData,
        monto: parseFloat(formData.monto)
      });

      setMessage({ type: 'success', text: 'Transferencia realizada exitosamente' });
      setFormData({
        cuenta_origen: '',
        cuenta_destino: '',
        monto: '',
        descripcion: ''
      });
      fetchAccounts(); // Actualizar balances
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al realizar la transferencia'
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="transfer-container">
        <div className="transfer-card">
          <h1>Realizar Transferencia</h1>
          <p className="transfer-subtitle">Transfiere dinero entre tus cuentas o a otras cuentas</p>

          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit} className="transfer-form">
            <div className="form-group">
              <label htmlFor="cuenta_origen">Cuenta de Origen</label>
              <select
                id="cuenta_origen"
                name="cuenta_origen"
                value={formData.cuenta_origen}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Selecciona una cuenta</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.numero_cuenta}>
                    {account.tipo_cuenta} - ****{account.numero_cuenta.slice(-4)} (L. {parseFloat(account.saldo).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cuenta_destino">Cuenta de Destino</label>
              <input
                id="cuenta_destino"
                name="cuenta_destino"
                type="text"
                value={formData.cuenta_destino}
                onChange={handleChange}
                required
                placeholder="Número de cuenta destino"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="monto">Monto</label>
              <input
                id="monto"
                name="monto"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.monto}
                onChange={handleChange}
                required
                placeholder="0.00"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción (opcional)</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Concepto de la transferencia"
                rows="3"
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Procesando...' : 'Realizar Transferencia'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Transfer;
