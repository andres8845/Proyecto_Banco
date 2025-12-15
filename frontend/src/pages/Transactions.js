import React, { useState, useEffect } from 'react';
import transactionService from '../apis/transactionService';
import Navbar from '../components/Navbar';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsData, accountsData] = await Promise.all([
        transactionService.getAllTransactions(),
        require('../apis/accountService').default.getAllAccounts()
      ]);
      setTransactions(transactionsData.transactions || []);
      setAccounts(accountsData.accounts || []);
      setLoading(false);
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true;
    // Considerar ambos tipos de transferencia
    if (filter === 'transferencia') {
      return transaction.tipo_transaccion === 'transferencia' ||
             transaction.tipo_transaccion === 'transferencia_enviada' ||
             transaction.tipo_transaccion === 'transferencia_recibida';
    }
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
                {filteredTransactions.map((transaction) => {
                  // Obtener las cuentas del usuario
                  const misCuentas = accounts.map(acc => acc.numero_cuenta);
                  
                  // Determinar si es ingreso o egreso
                  let esIngreso = false;
                  let tipoMostrar = transaction.tipo_transaccion;
                  
                  if (transaction.tipo_transaccion === 'deposito') {
                    esIngreso = true;
                    tipoMostrar = 'Depósito';
                  } else if (transaction.tipo_transaccion === 'retiro') {
                    esIngreso = false;
                    tipoMostrar = 'Retiro';
                  } else if (transaction.tipo_transaccion === 'transferencia_recibida') {
                    esIngreso = true;
                    tipoMostrar = 'Transferencia recibida';
                  } else if (transaction.tipo_transaccion === 'transferencia_enviada') {
                    esIngreso = false;
                    tipoMostrar = 'Transferencia enviada';
                  } else if (transaction.tipo_transaccion === 'transferencia') {
                    // Para transferencias antiguas, verificar si la cuenta destino es mía
                    esIngreso = misCuentas.includes(transaction.numero_cuenta_destino);
                    tipoMostrar = esIngreso ? 'Transferencia recibida' : 'Transferencia enviada';
                  }
                  
                  return (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.fecha_hora).toLocaleString()}</td>
                      <td>
                        <span className={`type-badge ${transaction.tipo_transaccion}`}>
                          {tipoMostrar}
                        </span>
                      </td>
                      <td>****{transaction.numero_cuenta_origen?.slice(-4)}</td>
                      <td>{transaction.descripcion || '-'}</td>
                      <td className={`amount ${esIngreso ? 'deposito' : 'retiro'}`}>
                        {esIngreso ? '+' : '-'}
                        L. {parseFloat(transaction.monto).toFixed(2)}
                      </td>
                      <td>
                        <span className={`status-badge ${transaction.estado}`}>
                          {transaction.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Transactions;
