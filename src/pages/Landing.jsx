import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

import logo from "../assets/logo.png";
import heroImage from "../assets/hero-image.png";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-section">
          <img src={logo} alt="logo" />
          <h2>OpenShelf</h2>
        </div>

        <ul className="nav-links">
          <li>Home</li>
          <li>Explore</li>
          <li>Collections</li>
          <li>About</li>
          <li>Contact</li>
        </ul>

        <button className="start-btn" onClick={() => navigate("/login")}>
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-left">
          <p className="tagline">Your Digital Library, Anytime Anywhere</p>

          <h1>
            Read. Learn.
            <br />
            <span>Inspire.</span>
          </h1>

          <p className="description">
            OpenShelf is your smart e-library platform to discover, access and
            grow with knowledge.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/login")}>
              Explore Library →
            </button>

            <button 
              className="watch-btn"
              onClick={() => {
                alert("📺 Opening OpenShelf Smart Library Tour Video...");
                window.open("https://www.youtube.com/watch?v=FgoQJ139U60", "_blank");
              }}
            >
              ▶ Watch Intro
            </button>
          </div>

          <div className="feature-boxes">
            <div className="feature-card">
              <h3>📘</h3>
              <p>Thousands of E-Books</p>
            </div>

            <div className="feature-card">
              <h3>🔍</h3>
              <p>Smart Search & Categories</p>
            </div>

            <div className="feature-card">
              <h3>📱</h3>
              <p>Access Across Devices</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <img src={heroImage} alt="Library Illustration" />
        </div>
      </section>
    </div>
  );
}

export default Landing;
