import { Link } from "react-router-dom";
import { FaTractor, FaSeedling, FaHandshake, FaIndustry, FaUsers, FaRegChartBar, FaLeaf, FaBullhorn } from "react-icons/fa";
import "./HomePage.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo">Farm IT</Link>
      </div>
      <ul className="navbar-links">
        <li><span className="navbar-link">Home</span></li>
        <li><span className="navbar-link">Features</span></li>
        <li><span className="navbar-link">About</span></li>
        <li><span className="navbar-link">Contact</span></li>
        <li className="navbar-dropdown">
          <button className="navbar-link">Account</button>
          <ul className="dropdown-menu">
            <li><Link to="/login" className="dropdown-item">Login</Link></li>
            <li><Link to="/register" className="dropdown-item">Sign Up</Link></li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

const HomePage = () => {
  return (
    <div className="homepage">
      <Navbar />
      <header className="header">
        <h1 className="title">Farm IT</h1>
        <p className="tagline">Connecting Farmers with Technology and Resources</p>
      </header>
      <section className="features">
        <h2 className="section-title">Our Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <FaTractor size={60} color="#2c3e50" />
            <h3>Farm Management Tools</h3>
            <p>Optimize your farming operations with advanced tools for every stage.</p>
          </div>
          <div className="feature-card">
            <FaSeedling size={60} color="#2c3e50" />
            <h3>Financial Support</h3>
            <p>Get access to funding and grow your farming business with ease.</p>
          </div>
          <div className="feature-card">
            <FaHandshake size={60} color="#2c3e50" />
            <h3>Market Access</h3>
            <p>Sell your crops directly to buyers through our marketplace.</p>
          </div>
          <div className="feature-card">
            <FaIndustry size={60} color="#2c3e50" />
            <h3>Advanced Analytics</h3>
            <p>Leverage data insights to improve farming efficiency and sustainability.</p>
          </div>
          <div className="feature-card">
            <FaUsers size={60} color="#2c3e50" />
            <h3>Community Support</h3>
            <p>Join a network of farmers and experts for knowledge sharing and advice.</p>
          </div>
          <div className="feature-card">
            <FaRegChartBar size={60} color="#2c3e50" />
            <h3>Real-Time Reporting</h3>
            <p>Monitor your farm's performance and growth with real-time reports and dashboards.</p>
          </div>
          <div className="feature-card">
            <FaLeaf size={60} color="#2c3e50" />
            <h3>Sustainability Solutions</h3>
            <p>Implement eco-friendly farming practices and reduce your environmental footprint.</p>
          </div>
          <div className="feature-card">
            <FaBullhorn size={60} color="#2c3e50" />
            <h3>Advertising & Promotion</h3>
            <p>Promote your farm and products to a larger audience and increase your visibility.</p>
          </div>
        </div>
      </section>
      <section className="about">
        <h2 className="section-title">About Us</h2>
        <p>
          Farm Connect is a platform dedicated to revolutionizing the agriculture sector by bridging the gap between farmers and technology. Our goal is to help farmers increase productivity, access funding, and easily connect with buyers.
        </p>
      </section>
      <section className="contact">
        <h2 className="section-title">Get in Touch</h2>
        <p>Have questions or need support? Reach out to us anytime!</p>
        <span to="/contact" className="cta-btn">Contact Us</span>
      </section>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Farm Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
