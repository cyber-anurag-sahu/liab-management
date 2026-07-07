import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import circulationService from "../services/circulationService";
import "../styles/dashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeUsers: 0,
    booksIssued: 0,
    totalFine: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await circulationService.getStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <MainLayout>

      <div className="dashboard-container">

        <h2>⚙️ Admin Dashboard</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading Admin Metrics...</p>
          </div>
        ) : (
          <div className="dashboard-grid">

            <div className="dashboard-card">
              <h4>Total Books</h4>
              <h2>{stats.totalBooks}</h2>
            </div>

            <div className="dashboard-card">
              <h4>Total Active Users</h4>
              <h2>{stats.activeUsers}</h2>
            </div>

            <div className="dashboard-card">
              <h4>Books Currently Issued</h4>
              <h2>{stats.booksIssued}</h2>
            </div>

            <div className="dashboard-card">
              <h4>Fine Revenue</h4>
              <h2>₹{stats.totalFine}</h2>
            </div>

          </div>
        )}

      </div>

    </MainLayout>
  );
}

export default AdminDashboard;