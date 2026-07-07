import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import circulationService from "../services/circulationService";
import bookService from "../services/bookService";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    borrowedCount: 0,
    overdueCount: 0,
    totalFine: 0,
    totalBooks: 0,
    availableBooks: 0,
    activeUsers: 0,
    booksIssued: 0
  });
  const [digitalCount, setDigitalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [statsData, digitalCounts] = await Promise.all([
          circulationService.getStats(),
          bookService.getDigitalResourcesCounts()
        ]);
        setStats(statsData);
        const totalDigital = 
          (digitalCounts.ebooks || 0) + 
          (digitalCounts.journals || 0) + 
          (digitalCounts.papers || 0) + 
          (digitalCounts.thesis || 0);
        setDigitalCount(totalDigital);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <MainLayout>
      <div className="dashboard-container">
        {/* Welcome Banner */}

        <div className="welcome-banner">
          <div>
            <h2>Welcome to OpenShelf 📚</h2>

            <p>
              Smart Library ERP for Students, Faculty, Librarians and
              Administrators
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading Dashboard Statistics...</p>
          </div>
        ) : (
          <>
            {/* Statistics */}

            <div className="dashboard-grid">
              <div 
                className="dashboard-card card-hover" 
                onClick={() => navigate("/circulation")}
                style={{ cursor: "pointer" }}
              >
                <h4>📚 Borrowed Books</h4>
                <h2>{stats.borrowedCount}</h2>
              </div>

              <div 
                className="dashboard-card card-hover"
                onClick={() => navigate("/circulation")}
                style={{ cursor: "pointer" }}
              >
                <h4>⚠️ Overdue Books</h4>
                <h2>{stats.overdueCount}</h2>
              </div>

              <div 
                className="dashboard-card card-hover"
                onClick={() => navigate("/circulation")}
                style={{ cursor: "pointer" }}
              >
                <h4>💰 Fine Due</h4>
                <h2>₹{stats.totalFine}</h2>
              </div>

              <div 
                className="dashboard-card card-hover"
                onClick={() => navigate("/digital-library")}
                style={{ cursor: "pointer" }}
              >
                <h4>💻 Digital Resources</h4>
                <h2>{digitalCount}</h2>
              </div>
            </div>

            <div className="dashboard-grid">
              <div 
                className="dashboard-card card-hover"
                onClick={() => navigate("/resources")}
                style={{ cursor: "pointer" }}
              >
                <h4>📚 Total Books</h4>
                <h2>{stats.totalBooks}</h2>
              </div>

              <div 
                className="dashboard-card card-hover"
                onClick={() => navigate("/resources")}
                style={{ cursor: "pointer" }}
              >
                <h4>✅ Available Books</h4>
                <h2>{stats.availableBooks}</h2>
              </div>

              <div 
                className="dashboard-card card-hover"
                onClick={() => {
                  if (userRole === "Admin") {
                    navigate("/user-management");
                  }
                }}
                style={{ cursor: userRole === "Admin" ? "pointer" : "default" }}
              >
                <h4>👥 Active Users</h4>
                <h2>{stats.activeUsers}</h2>
              </div>

              <div 
                className="dashboard-card card-hover"
                onClick={() => navigate("/circulation")}
                style={{ cursor: "pointer" }}
              >
                <h4>📦 Books Issued</h4>
                <h2>{stats.booksIssued}</h2>
              </div>
            </div>
          </>
        )}

        {/* Activity */}

        <div className="activity-section">
          <h4>Recent Activity</h4>

          <ul>
            <li>📚 Checked database for Overdue Books</li>

            <li>📖 Checked-in returned resources</li>

            <li>💰 Processed student circulation requests</li>
          </ul>
        </div>

        {/* Quick Actions */}

        <div className="quick-actions">
          <button 
            className="action-btn"
            onClick={() => navigate("/resources")}
          >
            🔍 Search Books
          </button>

          <button 
            className="action-btn"
            onClick={() => navigate("/resources")}
          >
            📚 Reserve Book
          </button>

          <button 
            className="action-btn"
            onClick={() => navigate("/digital-library")}
          >
            💻 Digital Library
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
