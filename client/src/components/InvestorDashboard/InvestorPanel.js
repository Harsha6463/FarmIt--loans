import React, { useState, useEffect } from "react";
import "./InvestorDashboard.css";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import API from "../../API";

const InvestorPanel = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const response = await API.get("/loans/my-investments");
      setInvestments(response.data);
    } catch (error) {
      console.error("Error fetching investments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const openPopup = (investment) => {
    setSelectedInvestment(investment);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedInvestment(null);
  };

  const getStatusClass = (status) => {
    return status === "verified" ? "status-verified" : "status-pending";
  };

  return (
    <>
      <Navbar UserType={"investor"} />
      <div className="investor-dashboard-container">
        <div className="dashboard-inner-content">
          <div className="dashboard-heading">
            <h1 className="title" style={{ marginTop: "100px", position: "relative", left: "400px" }}>
              Investor Dashboard
            </h1>
          </div>

          {loading ? (
            <p className="loading-message-text">
              <b>Loading your Investments...</b>
            </p>
          ) : investments.length > 0 ? (
            <div className="investment-cards-container">
              {investments.map((investment) => (
                <div key={investment._id} className="investment-card-item">
                  <img
                    src={
                      investment.farm?.images?.[0]
                        ? `http://localhost:3600/${investment.farm.images[0]}`
                        : "default-image.jpg"
                    }
                    alt="Farm Land"
                    className="investment-card-image"
                  />
                  <h2 className="investment-farm-title">
                    <b>Name : </b>{investment.farm?.name}
                  </h2>
                  <p className={getStatusClass(investment.status)}><b>Status :</b> {investment.status}</p>
                  <button onClick={() => openPopup(investment)} className="view-details-btn">
                    Dashboard Details...
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-investments-found">No investments found.</p>
          )}
        </div>
        <Link to={`/issue/investor`}>
          <button className="report-issue-btn">Report an Issue</button>
        </Link>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button className="close-popup-btn" onClick={closePopup}>X</button>
            <h2 style={{color:"white"}}>Investment Details</h2>
            <p><b>Name:</b> {selectedInvestment.farm?.name}</p>
            <p><b>Farm Description:</b> {selectedInvestment.farm?.description}</p>
            <p><b>Location:</b> {selectedInvestment.farm?.location}</p>
            <p><b>Investment Amount:</b> Rs:{selectedInvestment.amount}</p>
            <p><b>Farmer:</b> {selectedInvestment.farm?.farmer}</p>
            <p className={getStatusClass(selectedInvestment.status)}><b>Status:</b> {selectedInvestment.status}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default InvestorPanel;
