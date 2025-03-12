import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import API from "../../../API";
import "./AdminFarmsDashboard.css";

const AdminFarmsDashboard = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    setLoading(true);
    try {
      const response = await API.get("/admin/farms");
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar UserType={"admin"} />
      <div className="admin-farm-dashboard">
        <div className="farm-dashboard-content">
          <h1 className="title"style={{marginTop:"120px"}}>Admin Farms Dashboard</h1>
          {loading ? (
            <p className="loading-text">
              <b>Loading farms...</b>
            </p>
          ) : farms.length > 0 ? (
            <div className="farm-cards-list">
              {farms.map((farm) => (
                <div key={farm._id} className="farm-item-card">
                  <img
                    src={`http://localhost:3600/${farm.images[0]}`}
                    alt="Farm"
                    className="farm-card-image"
                  />
                  <h2><b>🌾</b>{farm.name}</h2>
                  <p>
                    <b>Farmer:</b> {farm.farmer.firstName}{" "}
                    {farm.farmer.lastName}
                  </p>
                  <p>
                    <b>Location:</b> {farm.location}
                  </p>
                  <p>
                    <b>Type:</b> {farm.farmType}
                  </p>
                  <p>
                    <b>Size:</b> {farm.size} acres
                  </p>
                  <p>
                    <b>Status:</b> {farm.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-farm-data">No farms found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminFarmsDashboard;
