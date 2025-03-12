import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import API from "../../API";
import Navbar from "../Navbar/Navbar"; 
import './Analytics.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    investments: [],
    repayments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await API.get("transactions/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const investments = response.data.investments;
      const repayments = response.data.repayments;

      setAnalytics({
        investments,
        repayments
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(error.message || "Failed to load analytics data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="loadingContainer">
        <div animation="border" role="status" />
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="errorContainer">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  const investmentData = analytics.investments.map((inv) => inv.totalAmount);
  const repaymentData = analytics.repayments.map((rep) => rep.totalAmount);
  
  const months = analytics.investments.map((inv) => {
    const monthNumber = inv._id; 
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthNumber - 1]; 
  });

  const chartData = {
    labels: months, 
    datasets: [
      {
        label: "Investments",
        data: investmentData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Repayments",
        data: repaymentData,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Investments and Repayments",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const datasetLabel = tooltipItem.dataset.label || '';
            const value = tooltipItem.raw;
            return `${datasetLabel}: Rs: ${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 15,
            weight: 'bold',
          },
          callback: (value) => `Rs:${value.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <>
      <Navbar UserType={"investor"} /> 
      <div className="container">
        <h2 className="title">Transaction Analytics</h2>
        <div className="chartContainer">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </>
  );
};

export default Analytics;
