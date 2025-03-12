import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import API from "../../../API";
import "./AdminIssuesDashboard.css";

const AdminIssuesDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await API.get("/issue/all-issues");
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar UserType={"admin"} />
      <div className="admin-issues-dashboard">
        <div className="issues-dashboard-content">
          <h1 className="title"  style={{marginTop:"90px"}}>Admin Issues Dashboard</h1>
          {loading ? (
            <p className="loading-text">
              <b>Loading issues...</b>
            </p>
          ) : issues.length > 0 ? (
            <div className="issues-cards-list">
              {issues.map((issue) => (
                <div key={issue._id} className="issue-item-card">
                  <h2>{issue.issueTitle}</h2>
                  <p>
                    <b>Reported By:</b> {issue.user}
                  </p>
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
            <p className="no-issue-data">No issues reported.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminIssuesDashboard;
