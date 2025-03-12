import React, { useState, useEffect } from "react";
import Navbar from ".././Navbar/Navbar";
import API from "../../API";
import {  NavLink } from "react-router-dom";
import "./UserIssues.css"
const UserIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    fetchUserIssues();
  }, []);

  const fetchUserIssues = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/issue/user-issues");
      setIssues(data.issues);
      setUserType(data.role);
    } catch (error) {
      console.error("Error fetching user issues:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar UserType={userType} />
      <div className="user-issues-container">
        <div style={{marginTop:"100px"}} className="user-issues-content">
          <h1 className="title">Your Reported Issues</h1>
          {loading ? (
            <p className="loading-message">
              <b>Loading issues...</b>
            </p>
          ) : issues.length > 0 ? (
            <div className="issue-list">
              {issues.map((issue) => (
                <div key={issue._id} className="issue-card">
                  <h2>{issue.issueTitle}</h2>
                  <p>
                    <b>Description:</b> {issue.issueDiscription}
                  </p>
                  <p>
                    <b>Reported On:</b>{" "}
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-issues">No issues reported yet.</p>
          )}
        </div>
      </div>
      <NavLink to={`/issue/investor`}>
        <button className="report-issue-btn">Report an Issue</button>
      </NavLink>
    </>
  );
};

export default UserIssues;