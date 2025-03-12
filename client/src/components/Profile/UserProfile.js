import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../API";
import './Profile.css';
import Navbar from "../Navbar/Navbar";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
        } else {
          const response = await API.get("http://localhost:3600/api/users/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);

          // Fetch documents after getting the profile
          const documentsResponse = await API.get("/documents/my-documents", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDocuments(documentsResponse.data);
        }
      } catch (err) {
        toast.error("Error fetching profile data");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container" style={{ marginTop: "100px" }}>
      <Navbar UserType={'farmer'} />
      <h1>User Profile</h1>
      <div className="profile-info">
        {user.profilePic && (
          <div className="profile-picture">
            <h3>Profile Picture:</h3>
            <img
              src={`http://localhost:3600/${user.profilePic}`}
              alt="Profile"
              className="profile-image"
            />
          </div>
        )}
        <div className="user-details">
        <h3>User Profile</h3>
          <div className="user-detail">
            
            <b>First Name:</b>
            <p style={{ fontSize: "1.30rem" }}>{user.firstName}</p>
          </div>
          <div className="user-detail">
            <b>Last Name:</b>
            <p style={{ fontSize: "1.30rem" }}>{user.lastName}</p>
          </div>
          <div className="user-detail">
            <b>Email:</b>
            <p style={{ fontSize: "1.30rem" }}>{user.email}</p>
          </div>
          <div className="user-detail">
            <b>Role:</b>
            <p style={{ fontSize: "1.30rem" }}>{user.role}</p>
          </div>
          <div className="user-detail">
            <b>Status:</b>
            <p
              style={{ fontSize: "1.30rem" }}
              className={user.isVerified ? 'verified' : 'not-verified'}
            >
              {user.isVerified ? "Verified" : "Not Verified"}
            </p>
          </div>

         
          <h3>My Documents Status</h3>
          <div>
            {documents.length === 0 ? (
              <p>No documents uploaded yet.</p>
            ) : (
              <ul>
                {documents.map((doc) => (
                  <li key={doc._id}>
                    <b style={{ fontWeight: 'bold' }}>{doc.title}</b> -{" "}
                    <span style={{ color: doc.isVerified ? "green" : "red" }}>
                      {doc.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

         
          <NavLink
            to="/documents"
            className="nav-item"
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "5px",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "black";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "black";
              e.target.style.color = "white";
            }}
          >
            Upload Documents
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
