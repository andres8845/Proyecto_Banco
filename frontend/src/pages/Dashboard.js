import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../apis/dashboardService';
import accountService from '../apis/accountService';
import transactionService from '../apis/transactionService';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalAccounts: 0,
    recentTransactions: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Usar los nuevos servicios para obtener datos
      const [dashboardStats, accountsData, transactionsData] = await Promise.all([
        dashboardService.getDashboardStats(),
        accountService.getAllAccounts(),
        transactionService.getRecentTransactions()
      ]);

      setStats({
        totalBalance: dashboardStats.total_balance || 0,
        totalAccounts: dashboardStats.total_accounts || 0,
        recentTransactions: dashboardStats.recent_transactions?.length || 0,
        monthlyIncome: dashboardStats.monthly_income || 0,
        monthlyExpenses: dashboardStats.monthly_expenses || 0
      });

      setAccounts(accountsData.accounts || []);
      setTransactions(transactionsData.transactions || []);

      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      setLoading(false);
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
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Bienvenido, {user?.nombre}</h1>
          <p>Este es el resumen de tus finanzas</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon balance">💰</div>
            <div className="stat-content">
              <p className="stat-label">Balance Total</p>
              <h2 className="stat-value">L. {stats.totalBalance.toFixed(2)}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon accounts">🏦</div>
            <div className="stat-content">
              <p className="stat-label">Cuentas Activas</p>
              <h2 className="stat-value">{stats.totalAccounts}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon transactions">📊</div>
            <div className="stat-content">
              <p className="stat-label">Transacciones Recientes</p>
              <h2 className="stat-value">{stats.recentTransactions}</h2>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="accounts-section">
            <h2>Mis Cuentas</h2>
            {accounts.length === 0 ? (
              <p className="empty-message">No tienes cuentas registradas aún.</p>
            ) : (
              <div className="accounts-list">
                {accounts.map((account) => (
                  <div key={account.id} className="account-card">
                    <div className="account-header">
                      <h3>{account.tipo_cuenta}</h3>
                      <span className={`account-status ${account.estado}`}>
                        {account.estado}
                      </span>
                    </div>
                    <p className="account-number">****{account.numero_cuenta?.slice(-4)}</p>
                    <p className="account-balance">L. {parseFloat(account.saldo).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="transactions-section">
            <h2>Transacciones Recientes</h2>
            {transactions.length === 0 ? (
              <p className="empty-message">No hay transacciones recientes.</p>
            ) : (
              <div className="transactions-list">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-icon">
                      {transaction.tipo_transaccion === 'deposito' ? '⬇️' : '⬆️'}
                    </div>
                    <div className="transaction-details">
                      <p className="transaction-type">{transaction.tipo_transaccion}</p>
                      <p className="transaction-date">
                        {new Date(transaction.fecha_hora).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`transaction-amount ${transaction.tipo_transaccion}`}>
                      {transaction.tipo_transaccion === 'deposito' ? '+' : '-'}
                      L. {parseFloat(transaction.monto).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
