import authService from "../services/authService";
import "../styles/navbar.css";

function Navbar() {
  const currentUser = authService.getCurrentUser();
  const displayInfo = currentUser 
    ? `👤 ${currentUser.name} (${currentUser.role})` 
    : "👤 Guest";

  return (
    <div className="navbar-custom">

      <h4>
        OpenShelf ERP
      </h4>

      <div className="user-info">
        {displayInfo}
      </div>

    </div>
  );
}

export default Navbar;