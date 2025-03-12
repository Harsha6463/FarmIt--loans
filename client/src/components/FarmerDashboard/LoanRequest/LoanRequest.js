import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../API";
import { toast } from "react-toastify";
import Navbar from "../../Navbar/Navbar";
import "./LoanRequest.css";

const LoanRequest = () => {
  const { farmId } = useParams();
  const [loanData, setLoanData] = useState({
    amount: "",
    interestRate: "",
    duration: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoanData({ ...loanData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/loans", {
        farmId,
        ...loanData,
      });

      toast.success("Loan request submitted successfully!");
      navigate("/farmerDashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error submitting loan request"
      );
    }
  };

  return (
    <>
      <Navbar isInvestor={false} />
      <div style={{marginTop:"200px"}} className="loan-request-form-container">
        <h2 >Request a Loan</h2>
        <form  onSubmit={handleSubmit}>
          <input
            type="number"
            name="amount"
            placeholder="Loan Amount"
            value={loanData.amount}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="interestRate"
            placeholder="Interest Rate (%)"
            value={loanData.interestRate}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration (months)"
            value={loanData.duration}
            onChange={handleChange}
            required
          />
          <button type="submit">Request Loan</button>
        </form>
      </div>
    </>
  );
};

export default LoanRequest;