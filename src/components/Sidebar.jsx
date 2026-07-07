import { NavLink, Link } from "react-router-dom";
import { FaBookOpen } from "react-icons/fa";
import logo from "../assets/logo.png";

import "../styles/sidebar.css";

function Sidebar() {

  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("role");
  };

  return (
    <div className="sidebar">

      <div className="sidebar-logo">

        <img
          src={logo}
          alt="OpenShelf"
          className="sidebar-logo-img"
        />

        <h3>OpenShelf</h3>

      </div>

      <ul>

        <li>
          <NavLink to="/dashboard">
            🏠 Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/resources">
            📚 Resources
          </NavLink>
        </li>

        <li>
          <NavLink to="/circulation">
            🔄 Circulation
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile">
            👤 Profile
          </NavLink>
        </li>

        <li>
          <NavLink to="/digital-library">
            <FaBookOpen />
            &nbsp; Digital Library
          </NavLink>
        </li>

        {(userRole === "Admin" ||
          userRole === "Librarian") && (
          <li>
            <NavLink to="/book-management">
              📚 Book Management
            </NavLink>
          </li>
        )}

        {userRole === "Admin" && (
          <li>
            <NavLink to="/user-management">
              👥 User Management
            </NavLink>
          </li>
        )}

        {(userRole === "Admin" ||
          userRole === "Librarian") && (
          <li>
            <NavLink to="/issue-return">
              🔄 Issue / Return
            </NavLink>
          </li>
        )}

        <li>
          <Link
            to="/"
            onClick={handleLogout}
          >
            🚪 Logout
          </Link>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;