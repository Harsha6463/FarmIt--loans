import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import API from "../../API";
import { toast } from "react-toastify";
import {  NavLink } from "react-router-dom";
import "./MyLoans.css";


const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await API.get("/loans/my-loans");
      setLoans(response.data);
    } catch (error) {
      toast.error("Failed to load loans");
    } finally {
      setLoading(false);
    }
  };

  const handleRepayment = async (loanId, amount, investorId) => {
    const farmerId = localStorage.getItem("farmerId");
    const confirmed = window.confirm(`Do you want to repay Rs. ${amount}?`);
    if (confirmed) {
      try {
        const response = await API.post(`/loans/${loanId}/repay`, {
          amount,
          fromUserId: farmerId,
          toUserId: investorId,
        });

        if (response.data?.message) {
          toast.success(response.data.message);
          fetchLoans();
        } else {
          toast.error("Unexpected response format.");
        }
      } catch {
        toast.error("Error while repaying amount.");
      }
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  return (
    <>
      <Navbar UserType={"farmer"} />
      <div style={{ marginTop: "70px" }} className="farmer-loans">
        <h1 className="title">My Loans</h1>

        {loading ? (
          <p className="loading">Loading loans...</p>
        ) : loans.length > 0 ? (
          <div className="loan-table-container">
            <table className="loan-table">
              <thead>
                <tr>
                  <th>Farm Name</th>
                  <th>Loan Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan._id}>
                    <td>{loan.farm.name}</td>
                    <td>Rs {loan.amount.toLocaleString()}</td>
                    <td>
                      <span className={`status ${loan.status.toLowerCase()}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => setSelectedLoan(loan)}
                      >
                        Repayment Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-loans">No loans found.</p>
        )}

<NavLink to={`/issue/farmer`}>
        <button className="report-issue-btn"> Report an Issue?</button>
      </NavLink>

        {selectedLoan && (
          <div className="modal-overlay">
            <div className="modal">
              <button
                className="close-btn"
                onClick={() => setSelectedLoan(null)}
              >
                X
              </button>
              <h2 style={{ color: "white" }}>{selectedLoan.farm.name}</h2>
              <p>
                <b>Loan Amount:</b> Rs {selectedLoan.amount.toLocaleString()}
              </p>
              <p>
                <b>Status:</b> {selectedLoan.status}
              </p>
              <h3>Repayment Schedule:</h3>
              <ul>
                {selectedLoan.repaymentSchedule.map((payment, index) => (
                  <li key={index} className="repayment-item">
                    <p>
                      <b>Due Date:</b>{" "}
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </p>
                    <p>
                      <b>Amount:</b> Rs {payment.amount.toLocaleString()}
                    </p>
                    <p>
                      <b>Status:</b> {payment.status}
                    </p>
                    {payment.status === "pending" && (
                      <button
                        className="repay-btn"
                        onClick={() =>
                          handleRepayment(
                            selectedLoan._id,
                            payment.amount,
                            selectedLoan.investors[0]?.investor._id
                          )
                        }
                      >
                        Repay
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyLoans;
