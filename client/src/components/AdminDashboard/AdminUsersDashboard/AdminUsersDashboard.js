import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import API from "../../../API";
import { ToastContainer, toast } from "react-toastify";
import "./AdminUsersDashboard.css";

const AdminUsersDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/verify`);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isVerified: true } : user
        )
      );
      if (selectedUser._id === userId) {
        setSelectedUser((prevUser) => ({
          ...prevUser,
          isVerified: true,
        }));
      }
      toast.success("User verified successfully!");
    } catch (error) {
      console.error("Error while verifying user:", error);
      toast.error("Failed to verify user.");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await API.delete(`/admin/deleteUser/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully!");
      closePopup();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const openPopup = (user) => {
    setSelectedUser(user);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedUser(null);
  };

  return (
    <>
      <ToastContainer />
      <Navbar UserType={"admin"} />
      <div className="admin-dashboard">
        <div className="dashboard-content">
          <h1 className="title" style={{ marginTop: "50px" }}>Users Dashboard</h1>
          {loading ? (
            <p className="loading-message">
              <b>Loading users...</b>
            </p>
          ) : users.length > 0 ? (
            <div className="user-list">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="user-card"
                  style={{
                    backgroundColor: user.isVerified ? "#e0ffa3" : "cornsilk",
                  }}
                >
                  <h2>{user.firstName} {user.lastName}</h2>
                  <p><b>Email:</b> {user.email}</p>
                  <p><b>Role:</b> {user.role}</p>
                  <button
                    className="view-details-btn"
                    onClick={() => openPopup(user)}
                  >
                    User Details
                  </button>
                  
                </div>
              ))}
            </div>
          ) : (
            <p className="no-users">No users found.</p>
          )}
        </div>
      </div>

      {showPopup && selectedUser && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button className="close-popup-btn" onClick={closePopup}>X</button>
            <h2 style={{ color: "blue" }}>User Details</h2>
            <p><b>Name:</b> {selectedUser.firstName} {selectedUser.lastName}</p>
            <p><b>Email:</b> {selectedUser.email}</p>
            <p><b>Role:</b> {selectedUser.role}</p>
            <p><b>Verified:</b> {selectedUser.isVerified ? "Yes" : "No"}</p>
            {!selectedUser.isVerified && (
              <button
                className="verify-btn"
                onClick={() => verifyUser(selectedUser._id)}
              >
                Verify User
              </button>
            )}
            <button
              className="delete-btn"
              onClick={() => deleteUser(selectedUser._id)}
            >
              Delete User
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsersDashboard;
