import React, { useState, useEffect } from "react";
import "./AddFarm.css";
import Navbar from "../../Navbar/Navbar";
import API from "../../../API";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddFarm = () => {
  const [farmData, setFarmData] = useState({
    name: "",
    description: "",
    location: "",
    farmType: "",
    size: "",
    productionCapacity: "",
    images: [],
  });
  const [documents, setDocuments] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkDocumentStatus = async () => {
      try {
        const response = await API.get("/documents/my-documents");
        console.log(response.data);
        setDocuments(response.data);

        let verified = false;
        response.data.forEach((document) => {
          console.log(document.isVerified)
          if (document.isVerified ) {
            verified = true;
          }
        });
        setIsVerified(verified);
        console.log("Document verified:", verified);
      } catch (error) {
        toast.error("Error fetching documents status");
        console.error("Error fetching documents:", error);
      }
    };

    checkDocumentStatus();
  }, []);

  const handleChange = (e) => {
    console.log("Input changed:", e.target.name, e.target.value);
    setFarmData({ ...farmData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    console.log("Images changed:", e.target.files);
    setFarmData({ ...farmData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    if (!isVerified) {
      toast.error("You cannot add a farm until your documents are verified.");
      console.log("Form submission blocked - Documents not verified");
      return;
    }

    const formData = new FormData();
    for (const key in farmData) {
      if (key === "images") {
        for (let i = 0; i < farmData.images.length; i++) {
          formData.append("images", farmData.images[i]);
        }
      } else {
        formData.append(key, farmData[key]);
      }
    }

    try {
      console.log("Sending farm data:", formData);
      await API.post("/farms/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Farm added successfully!");
      console.log("Farm added successfully!");
      navigate("/farmerDashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error during adding farm land"
      );
      console.error("Error during farm addition:", error);
    }
  };

  return (
    <>
      <Navbar UserType={"farmer"} />
      <div style={{ marginTop: "100px" }} className="card">
        <div className="card-image">
          <div className="card-heading">
            Add Farm Land
            <small>Add farm details below</small>
          </div>
        </div>

        <div className="card-form">
          <form onSubmit={handleSubmit}>
            <div className="input">
              <input
                type="text"
                name="name"
                className="input-field"
                value={farmData.name}
                onChange={handleChange}
                required
              />
              <label className="input-label">Farm Name</label>
            </div>

            <div className="input">
              <textarea
                name="description"
                className="input-field"
                value={farmData.description}
                onChange={handleChange}
                required
              />
              <label className="input-label">Description</label>
            </div>

            <div className="input">
              <input
                type="text"
                name="location"
                className="input-field"
                value={farmData.location}
                onChange={handleChange}
                required
              />
              <label className="input-label">Location</label>
            </div>

            <div className="input">
              <input
                type="text"
                name="farmType"
                className="input-field"
                value={farmData.farmType}
                onChange={handleChange}
                required
              />
              <label className="input-label">Farm Type</label>
            </div>

            <div className="input">
              <input
                type="number"
                name="size"
                className="input-field"
                value={farmData.size}
                onChange={handleChange}
                required
              />
              <label className="input-label">Size</label>
            </div>

            <div className="input">
              <input
                type="text"
                name="productionCapacity"
                className="input-field"
                value={farmData.productionCapacity}
                onChange={handleChange}
                required
              />
              <label className="input-label">Production Capacity</label>
            </div>

            <div className="input">
              <input
                type="file"
                name="images"
                className="input-field"
                multiple
                onChange={handleImageChange}
              />
              <label className="input-label">Farm Images</label>
            </div>

            <div className="action">
              <button  type="submit" className="action-button" disabled={!isVerified}>
                Add Farm
              </button>
            </div>
          </form>
        </div>

        <div className="card-info">
          <p>Upload your farm's images and details above.</p>
        </div>

        <div className="documents-status">
          <h3>Documents Status</h3>
          {documents.length === 0 ? (
            <p>No documents found.</p>
          ) : (
            documents.map((document) => (
              <div key={document._id}>
                <p>{document.title}</p>
                <span status style={{ color: document.isVerified ? "green" : "red" }}>
                      {document.isVerified ? "Verified" : "Not Verified"}
                    </span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AddFarm;
