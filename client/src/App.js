import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import { ToastContainer } from "react-toastify";
import HomePage from "./components/HomePage/HomePage";
import InvestorFeed from "./components/InvestorFeed/InvestorFeed";
import FarmerDashboard from "./components/FarmerDashboard/FarmerDashboard/FarmerDashboard";
import AddFarm from "./components/FarmerDashboard/AddFarm/AddFarm";
import LoanRequest from "./components/FarmerDashboard/LoanRequest/LoanRequest";
import Issue from "./components/IssuePage/Issue";
import AdminUsersDashboard from "./components/AdminDashboard/AdminUsersDashboard/AdminUsersDashboard";
import AdminLoansDashboard from "./components/AdminDashboard/AdminLoansDashboard/AdminLoansDashboard";
import AdminFarmsDashboard from "./components/AdminDashboard/AdminFarmsDashboard/AdminFarmsDashboard";
import AdminIssuesDashboard from "./components/AdminDashboard/AdminIssuesDashboard/AdminIssuesDashboard";
import InvestorPanel from "./components/InvestorDashboard/InvestorPanel";
import UserTransactions from "./components/UserTransactions/UserTransaction";
import InvestorTracking from "./components/Tracking/InvestorTracking";
import UserIssues from "./components/UserIssues/UserIssues";
import MyLoans from "./components/Myloans/MyLoans";
import Analytics from "./components/Analytics/Analytics";
import DocumentsUpload from "./components/Documents/DocumentsUpload";
import MyDocuments from "./components/Documents/MyDocuments";
import UserProfile from "./components/Profile/UserProfile";
import GetDocuments from "./components/AdminDashboard/AdminDocuments/GetDocumets";
import AdminVerifyInvestments from "./components/AdminDashboard/VerifyInvestments/AdminVerifyInvestments";






function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/investorFeed" element={<InvestorFeed />} />
          <Route path="/investorDashboard" element={<InvestorPanel />} />
          <Route path="/farmerDashboard" element={<FarmerDashboard />} />
          <Route path="/addFarm" element={<AddFarm />} />
          <Route path="/loanRequest/:farmId" element={<LoanRequest />} />
          <Route path="/userissues" element={<UserIssues />} />
          <Route path="/issue/:userType" element={<Issue />} />
          <Route path="/loanRequest/:farmId" element={<LoanRequest />} />
          <Route path="/investorTracking" element={<InvestorTracking />} />
          <Route path="/my-loans" element={<MyLoans />} />
          <Route path="/userTransactions" element={<UserTransactions />} />
          <Route path="/Analytics" element={<Analytics />} />
          <Route path="/documents" element={<DocumentsUpload />} />
          <Route path="/my-documents" element={<MyDocuments />} />
          <Route path="/profile" element={<UserProfile></UserProfile>} />
          <Route path="/userDocuments" element={<GetDocuments></GetDocuments>} />
          <Route path="/verifyInvestments" element={<AdminVerifyInvestments></AdminVerifyInvestments>} />
          <Route
            path="/adminUsersDashboard"
            element={<AdminUsersDashboard />}
          />
          <Route
            path="/adminLoansDashboard"
            element={<AdminLoansDashboard />}
          />
          <Route
            path="/adminFarmsDashboard"
            element={<AdminFarmsDashboard />}
          />
          <Route
            path="/adminIssuesDashboard"
            element={<AdminIssuesDashboard />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
