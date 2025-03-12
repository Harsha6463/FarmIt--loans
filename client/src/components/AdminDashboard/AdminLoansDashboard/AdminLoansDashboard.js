import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import API from "../../../API";
import "./AdminLoansDashboard.css";

const AdminLoansDashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await API.get("/admin/loans");
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar UserType={"admin"} />
      <div className="admin-dashboard">
        <div className="dashboard-content">
          <h1 className="title"  style={{marginTop:"50px"}}>Admin Loans Dashboard</h1>
          {loading ? (
            <p className="loading-message">
              <b>Loading loans...</b>
            </p>
          ) : loans.length > 0 ? (
            <div className="loan-list">
              {loans.map((loan) => (
                <div key={loan._id} className="loan-card">
                  <h2>Farm: {loan.farm ? loan.farm.name : "No farm name available"}</h2>
                  <p>
                    <b>Loan Id:</b> Rs {loan._id}
                  </p>
                  <p>
                    <b>Amount:</b> Rs {loan.amount}
                  </p>
                  <p>
                    <b>Interest Rate:</b> {loan.interestRate}%
                  </p>
                  <p>
                    <b>Duration:</b> {loan.duration} months
                  </p>
                  <p>
                    <b>Status:</b> {loan.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-loans">No loans found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminLoansDashboard;
