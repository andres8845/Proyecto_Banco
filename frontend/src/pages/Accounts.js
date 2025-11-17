import React, { useState, useEffect } from 'react';
import api from '../apis/axiosInstance';
import Navbar from '../components/Navbar';
import './Accounts.css';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    tipo_cuenta: 'ahorro',
    saldo_inicial: 0
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data.accounts || []);
      setLoading(false);
    } catch (error) {
      console.error('Error obteniendo cuentas:', error);
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await api.post('/accounts', newAccount);
      setShowModal(false);
      setNewAccount({ tipo_cuenta: 'ahorro', saldo_inicial: 0 });
      fetchAccounts();
    } catch (error) {
      console.error('Error creando cuenta:', error);
      alert('Error al crear la cuenta');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="accounts-container">
        <div className="accounts-header">
          <h1>Mis Cuentas</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Nueva Cuenta
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="empty-state">
            <p>No tienes cuentas registradas aún.</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Crear tu primera cuenta
            </button>
          </div>
        ) : (
          <div className="accounts-grid">
            {accounts.map((account) => (
              <div key={account.id} className="account-detail-card">
                <div className="account-card-header">
                  <h3>{account.tipo_cuenta}</h3>
                  <span className={`badge ${account.estado}`}>{account.estado}</span>
                </div>
                
                <div className="account-info">
                  <div className="info-row">
                    <span className="info-label">Número de Cuenta:</span>
                    <span className="info-value">{account.numero_cuenta}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Saldo Disponible:</span>
                    <span className="info-value balance">
                      L. {parseFloat(account.saldo).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="info-row">
                    <span className="info-label">Fecha de Apertura:</span>
                    <span className="info-value">
                      {new Date(account.fecha_apertura).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Crear Nueva Cuenta</h2>
              <form onSubmit={handleCreateAccount}>
                <div className="form-group">
                  <label>Tipo de Cuenta</label>
                  <select
                    value={newAccount.tipo_cuenta}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, tipo_cuenta: e.target.value })
                    }
                  >
                    <option value="ahorro">Ahorro</option>
                    <option value="corriente">Corriente</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Saldo Inicial</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newAccount.saldo_inicial}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, saldo_inicial: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crear Cuenta
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Accounts;
