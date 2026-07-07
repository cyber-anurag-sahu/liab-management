import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import circulationService from "../services/circulationService";
import "../styles/dashboard.css";

function LibrarianDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    borrowedCount: 0,
    overdueCount: 0,
    totalFine: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await circulationService.getStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load librarian stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <MainLayout>

      <div className="dashboard-container">

        <h2>📚 Librarian Dashboard</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading Librarian Metrics...</p>
          </div>
        ) : (
          <div className="dashboard-grid">

            <div className="dashboard-card">
              <h4>Total Books</h4>
              <h2>{stats.totalBooks}</h2>
            </div>

            <div className="dashboard-card">
              <h4>Active Loans</h4>
              <h2>{stats.borrowedCount}</h2>
            </div>

            <div className="dashboard-card">
              <h4>Overdue Books</h4>
              <h2>{stats.overdueCount}</h2>
            </div>

            <div className="dashboard-card">
              <h4>Pending Fines</h4>
              <h2>₹{stats.totalFine || 0}</h2>
            </div>

          </div>
        )}

        <div className="quick-actions">

          <button 
            className="action-btn"
            onClick={() => navigate("/book-management")}
          >
            Add Book
          </button>

          <button 
            className="action-btn"
            onClick={() => navigate("/issue-return")}
          >
            Issue Book
          </button>

          <button 
            className="action-btn"
            onClick={() => navigate("/issue-return")}
          >
            Return Book
          </button>

          <button 
            className="action-btn"
            onClick={() => navigate("/user-management")}
          >
            Manage Users
          </button>

        </div>

      </div>

    </MainLayout>
  );
}

export default LibrarianDashboard;