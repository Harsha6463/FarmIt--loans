import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import farmRoutes from "./Routes/farmRoutes.js";
import investmentRoutes from "./Routes/investmentRoutes.js";
import transactionRoutes from "./Routes/transactionRoutes.js";
import documentRoutes from "./Routes/documentRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import issueRoutes from "./Routes/issueRoutes.js";
import loanRoutes from "./Routes/loanRoutes.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/farms", farmRoutes);
app.use("/api/loans",loanRoutes)
app.use("/api/investments", investmentRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/issue", issueRoutes);

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3600;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
