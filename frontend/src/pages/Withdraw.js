import React, { useState, useEffect } from 'react';
import accountService from '../apis/accountService';
import transactionService from '../apis/transactionService';
import Navbar from '../components/Navbar';
import './Transfer.css'; // Reutilizar estilos similares

const Withdraw = () => {
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    numero_cuenta: '',
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
      const data = await accountService.getAllAccounts();
      setAccounts(data.accounts || []);
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

    if (!formData.numero_cuenta) {
      setMessage({ type: 'error', text: 'Debes seleccionar una cuenta' });
      return;
    }

    if (parseFloat(formData.monto) <= 0) {
      setMessage({ type: 'error', text: 'El monto debe ser mayor a 0' });
      return;
    }

    // Validar saldo disponible
    const selectedAccount = accounts.find(acc => acc.numero_cuenta === formData.numero_cuenta);
    if (selectedAccount && parseFloat(formData.monto) > parseFloat(selectedAccount.saldo)) {
      setMessage({ type: 'error', text: 'Saldo insuficiente' });
      return;
    }

    setLoading(true);

    try {
      await transactionService.withdraw({
        ...formData,
        monto: parseFloat(formData.monto)
      });

      setMessage({ type: 'success', text: 'Retiro realizado exitosamente' });
      setFormData({
        numero_cuenta: '',
        monto: '',
        descripcion: ''
      });
      fetchAccounts();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al realizar el retiro'
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="transfer-container">
        <div className="transfer-card">
          <h1>Realizar Retiro</h1>
          <p className="transfer-subtitle">Retira dinero de una de tus cuentas</p>

          {message.text && (
            <div className={`message ${message.type}`}>{message.text}</div>
          )}

          <form onSubmit={handleSubmit} className="transfer-form">
            <div className="form-group">
              <label htmlFor="numero_cuenta">Cuenta de Origen</label>
              <select
                id="numero_cuenta"
                name="numero_cuenta"
                value={formData.numero_cuenta}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Selecciona una cuenta</option>
                {accounts.map((account) => (
                  <option key={account.numero_cuenta} value={account.numero_cuenta}>
                    {account.tipo_cuenta} - ****{account.numero_cuenta?.slice(-4)} 
                    (L. {parseFloat(account.saldo).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="monto">Monto</label>
              <input
                type="number"
                id="monto"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción (Opcional)</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Escribe una nota sobre este retiro"
                disabled={loading}
                rows="3"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Realizar Retiro'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Withdraw;
