import Sidebar from "../components/Sidebar";
import "../styles/mainlayout.css";

function MainLayout({ children }) {
  return (
    <div className="layout-container">
      <Sidebar />

      <div className="main-content">

        <header className="topbar">

          <div>
            <h3>📚 OpenShelf ERP</h3>
            <p>Smart Library Management System</p>
          </div>

          <div className="topbar-user">
            👤 Student
          </div>

        </header>

        <main>
          {children}
        </main>

      </div>
    </div>
  );
}

export default MainLayout;