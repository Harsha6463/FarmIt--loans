import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../API";
import { toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import "./Issue.css";

const Issue = () => {
  const { userType } = useParams();
  const [issueData, setIssueData] = useState({
    issueTitle: "",
    issueDiscription: "",
  });
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleChange = (e) => {
    setIssueData({ ...issueData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/issue/add-issue", {
        ...issueData,
        userId,
      });
      console.log(response)
      toast.success("Issue submitted successfully!");
      if (userType === "investor") navigate("/investorDashboard");
      else if (userType === "farmer") navigate("/farmerDashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error submitting the issue"
      );
    }
  };

  return (
    <>
      <Navbar isInvestor={userType === "investor"} />
      <div style={{marginTop:"200px"}} className="report-issue-container">
        <h2  className="report-issue-title">Report an Issue</h2>
        <form className="issue-report-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="issueTitle"
            placeholder="Issue Title"
            value={issueData.issueTitle}
            onChange={handleChange}
            required
            className="issue-title-input"
          />
          <textarea
            name="issueDiscription"
            placeholder="Describe your issue"
            value={issueData.issueDiscription}
            onChange={handleChange}
            required
            className="issue-description-textarea"
          />
          <button type="submit" className="submit-issue-button">
            Submit Issue
          </button>
        </form>
      </div>
    </>
  );
};

export default Issue;