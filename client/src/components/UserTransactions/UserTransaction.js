import React, { useState, useEffect } from 'react';
import API from '../../API';
import './UserTransactions.css';
import Navbar from '../Navbar/Navbar';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await API.get('/transactions/my-transactions', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="transactions-page">
      <Navbar UserType={"admin"} />
      <h1 style={{marginTop:"80px"}} className="title">Transactions History</h1>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="loading" style={{ color: 'red' }}>{error}</p>}
      {transactions && transactions.length > 0 ? (
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th> 
                <th>Loan Amount</th>
                <th>Interest Rate</th>
                <th>From (Investor)</th>
                <th>To (Farmer)</th>
                <th>Transaction Amount</th>
                <th>Transaction Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => {
                const loan = transaction.loan;
                const loanAmount = loan ? loan.amount : 'N/A';
                const interestRate = loan ? loan.interestRate : 'N/A';
                return (
                  <tr key={transaction._id}>
                    <td>{transaction._id}</td> {/* Display the Transaction ID */}
                    <td>{loanAmount}</td>
                    <td>{interestRate}%</td>
                    <td>{transaction.from.firstName} {transaction.from.lastName}</td>
                    <td>{transaction.to.firstName} {transaction.to.lastName}</td>
                    <td>{transaction.amount}</td>
                    <td>
                      <span className={`status ${transaction.type === 'investment' ? 'investment' : 'repayment'}`}>
                        {transaction.type === 'investment' ? 'Investment' : 'Repayment'}
                      </span>
                    </td>
                    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-transactions-message">No transactions found</p>
      )}
    </div>
  );
};

export default TransactionsPage;
