import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    profilePic: null,
  });
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.role) {
   
      toast.error("Please fill in all required fields!");
      return;
    }

    const formToSubmit = new FormData();
    formToSubmit.append("firstName", formData.firstName);
    formToSubmit.append("lastName", formData.lastName);
    formToSubmit.append("email", formData.email);
    formToSubmit.append("password", formData.password);
    formToSubmit.append("role", formData.role);
    if (formData.profilePic) {
      formToSubmit.append("profilePic", formData.profilePic);
    }

    try {
      await axios.post("http://localhost:3600/api/auth/register", formToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
     
      toast.error(err.response?.data?.message || "Error during registration");
    }
  };


  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePic: e.target.files[0],
    });
  };

  return (
    <div style={{ marginTop: "100px" }} className="main-container">
      <form onSubmit={handleSubmit} className="form-container">
        <h1>Register</h1>
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <select
          className="select-input"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="farmer">Farmer</option>
          <option value="investor">Investor</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          placeholder="Profile Picture (Optional)"
        />

        {formData.profilePic && (
          <div>
            <h3>Preview Profile Picture:</h3>
            <img
              src={URL.createObjectURL(formData.profilePic)}
              alt="Profile Pic"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        )}

        <h4>
          If you have already Registered,{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </h4>
        <button type="submit" className="submit-btn">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
