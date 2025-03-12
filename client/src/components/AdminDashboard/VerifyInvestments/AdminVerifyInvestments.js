import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../../../API";
import Navbar from "../../Navbar/Navbar";
import './Verified.css'

const AdminDashboard = () => {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPendingLoans = async () => {
    setLoading(true);
    try {
      const response = await API.get("/loans/pending-investments");
      setPendingLoans(response.data);
    } catch (error) {
      console.error("Error fetching pending loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyInvestment = async (loanId, investorId) => {
    try {
      await API.post("/loans/verify-investment", {
        loanId: loanId,
        investorId: investorId,
      });
      toast.success("Investment verified successfully!");
      getPendingLoans(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Error verifying investment");
    }
  };

  const creditInvestment = async (loanId, investorId) => {
    try {
      setPendingLoans(prevLoans => prevLoans.map(loan =>
        loan._id === loanId ? { ...loan, status: "credited" } : loan
      ));

      await API.post("/loans/credit-investment", {
        loanId: loanId,
        investorId: investorId,
      });
      toast.success("Investment credited successfully!");
      getPendingLoans(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Error crediting investment");
      setPendingLoans(prevLoans => prevLoans.map(loan =>
        loan._id === loanId ? { ...loan, status: "verified" } : loan
      ));
    }
  };

  useEffect(() => {
    getPendingLoans();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar UserType={"admin"} />
      <h1 className="title" style={{ marginTop: "100px" }}>Admin Dashboard - Pending Loans</h1>

      {loading ? (
        <p>Loading pending loans...</p>
      ) : (
        <div className="loan-list">
          {pendingLoans.length > 0 ? (
            pendingLoans.map((loan) => (
              <div key={loan._id} className="loan-item">
                <h3>{loan.farm.name}</h3>
                <p><b>Status:</b> {loan.status}</p>
                <p><b>Amount:</b> {loan.amount}</p>
                <p><b>Requested Interest Rate:</b> {loan.interestRate}</p>
                <p><b>Duration:</b> {loan.duration}</p>

                <button 
                  onClick={() => verifyInvestment(loan._id, loan.investors[0].investor)} 
                >
                  Verify Investment
                </button>
                <button 
                  className="credit"
                  onClick={() => creditInvestment(loan._id, loan.investors[0].investor)} 
                  disabled={loan.status === "credited"}>
                  Credit Investment
                </button>
              </div>
            ))
          ) : (
            <p>No pending loans found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
