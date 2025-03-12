import React, { useEffect, useState } from "react";
import API from "../../API";
import './Document.css';
import Navbar from "../Navbar/Navbar";
import { toast } from 'react-toastify';

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.get("/documents/my-documents", config);
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch documents");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in first.");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      await API.delete(`/documents/${id}`, config);
      toast.success("Document deleted successfully!");
      fetchDocuments(); // Re-fetch documents after deletion
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error(error.response?.data?.message || "Failed to delete document");
    }
  };

  return (
    <div className="document-container">
      <Navbar UserType="farmer" />
      <h2 className="title" style={{marginTop:"100px"}}>  My Documents</h2>
      {documents.length === 0 ? (
        <p className="no-documents">No documents uploaded.</p>
      ) : (
        <table className="document-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Uploaded</th>
              <th>ID</th>
              <th>Status</th> 
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.title}</td>
                <td>{doc.type}</td>
                <td>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                <td>{doc._id}</td>
                <td style={{ color: doc.isVerified ? 'green' : 'red' }}>
                  {doc.isVerified ? "Verified" : "Not Verified"}
                </td> 
                <td>
                  <a
                    href={`http://localhost:3600/${doc.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-button"
                  >
                    View
                  </a>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(doc._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyDocuments;
