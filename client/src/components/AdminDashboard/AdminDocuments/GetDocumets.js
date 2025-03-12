import React, { useEffect, useState } from 'react';
import API from '../../../API';
import Navbar from '../../Navbar/Navbar';
import { toast } from 'react-toastify';
import './GetDocuments.css';

const GetDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await API.get('http://localhost:3600/api/admin/documents', {
          headers: {
            'Authorization': `Bearer YOUR_JWT_TOKEN`,
          },
        });
        setDocuments(response.data);
      } catch (err) {
        setError('Failed to fetch documents');
        console.error(err);
        toast.error('Failed to fetch documents');
      }
    };

    fetchDocuments();
  }, []); 

  const handleVerify = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in first.');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await API.put(
        `http://localhost:3600/api/admin/documents/${id}/verify`,
        {},
        config
      );

      const updatedDocument = response.data;
      setDocuments(documents.map(doc => doc._id === updatedDocument._id ? updatedDocument : doc));
      toast.success('Document verified successfully!');
    } catch (error) {
      console.error('Error verifying document:', error);
      toast.error(error.response?.data?.message || 'Failed to verify document');
    }
  };

  return (
    <div className="document-container">
      <Navbar UserType="admin" />
      <h2>Documents List</h2>
      {error && <p>{error}</p>}
      {documents.length === 0 ? (
        <p className="no-documents">No documents available.</p>
      ) : (
        <table className="document-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Uploaded</th>
              <th>Uploaded By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.title}</td>
                <td>{doc.type}</td>
                <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
                <td>{doc._id}</td>
                <td>
                  <a
                    href={`http://localhost:3600/${doc.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-button"
                  >
                    View
                  </a>
                  <a
                    href={`http://localhost:3600/${doc.filePath}`}
                    download
                    className="download-button"
                  >
                    Download
                  </a>
                  {!doc.isVerified && (
                    <button
                      className="verify-button"
                      onClick={() => handleVerify(doc._id)}
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GetDocuments;
