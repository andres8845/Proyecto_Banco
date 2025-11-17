import React, { useState, useEffect } from 'react';
import api from '../apis/axiosInstance';
import Navbar from '../components/Navbar';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data.transactions || []);
      setLoading(false);
    } catch (error) {
      console.error('Error obteniendo transacciones:', error);
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true;
    return transaction.tipo_transaccion === filter;
  });

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
      <div className="transactions-container">
        <div className="transactions-header">
          <h1>Mis Transacciones</h1>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button
              className={`filter-btn ${filter === 'deposito' ? 'active' : ''}`}
              onClick={() => setFilter('deposito')}
            >
              Depósitos
            </button>
            <button
              className={`filter-btn ${filter === 'retiro' ? 'active' : ''}`}
              onClick={() => setFilter('retiro')}
            >
              Retiros
            </button>
            <button
              className={`filter-btn ${filter === 'transferencia' ? 'active' : ''}`}
              onClick={() => setFilter('transferencia')}
            >
              Transferencias
            </button>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No hay transacciones para mostrar.</p>
          </div>
        ) : (
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Cuenta</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.fecha_hora).toLocaleString()}</td>
                    <td>
                      <span className={`type-badge ${transaction.tipo_transaccion}`}>
                        {transaction.tipo_transaccion}
                      </span>
                    </td>
                    <td>****{transaction.numero_cuenta?.slice(-4)}</td>
                    <td>{transaction.descripcion || '-'}</td>
                    <td className={`amount ${transaction.tipo_transaccion}`}>
                      {transaction.tipo_transaccion === 'deposito' ? '+' : '-'}
                      L. {parseFloat(transaction.monto).toFixed(2)}
                    </td>
                    <td>
                      <span className={`status-badge ${transaction.estado}`}>
                        {transaction.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Transactions;
