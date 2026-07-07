import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import authService from "../services/authService";

function Profile() {
  const [user, setUser] = useState(() => {
    return authService.getCurrentUser() || {
      name: "Student User",
      email: "student@openshelf.com",
      role: "Student",
      department: "MCA"
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [department, setDepartment] = useState(user.department || "");

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert("Name and Email cannot be empty.");
      return;
    }

    const updatedUser = { ...user, name, email, department };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);

    alert("🎉 Profile updated successfully!");
    // Reload page to reflect updated name in the Navbar immediately
    window.location.reload();
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setDepartment(user.department || "");
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <div
        style={{
          minHeight: "100vh",
          padding: "30px",
          background: "linear-gradient(135deg,#dceeff,#ffd6e7)"
        }}
      >
        <h2>👤 My Profile</h2>

        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            marginTop: "20px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
            maxWidth: "600px"
          }}
        >
          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: "600" }}>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: "600" }}>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: "600" }}>Department</label>
                <input
                  type="text"
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. MCA, CSE"
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: "600" }}>Role</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={user.role}
                  disabled
                  title="Role cannot be changed manually."
                />
                <small className="text-muted">Role is set by system admin.</small>
              </div>

              <div className="mt-4 d-flex gap-2">
                <button type="submit" className="btn btn-success px-4" style={{ borderRadius: "10px" }}>
                  Save Changes
                </button>
                <button type="button" className="btn btn-secondary px-4" onClick={handleCancel} style={{ borderRadius: "10px" }}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-4">
                <span className="text-muted" style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Full Name</span>
                <h4 style={{ fontWeight: "600", marginTop: "5px" }}>{user.name}</h4>
              </div>

              <div className="mb-4">
                <span className="text-muted" style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Email Address</span>
                <h4 style={{ fontWeight: "600", marginTop: "5px" }}>{user.email}</h4>
              </div>

              <div className="mb-4">
                <span className="text-muted" style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>System Role</span>
                <h4 style={{ fontWeight: "600", marginTop: "5px" }}>
                  <span className={`badge ${
                    user.role === "Admin" ? "bg-danger" : 
                    user.role === "Librarian" ? "bg-primary" : 
                    user.role === "Faculty" ? "bg-info text-dark" : "bg-secondary"
                  }`}>
                    {user.role}
                  </span>
                </h4>
              </div>

              <div className="mb-4">
                <span className="text-muted" style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>Department</span>
                <h4 style={{ fontWeight: "600", marginTop: "5px" }}>{user.department || "N/A"}</h4>
              </div>

              <button
                className="btn btn-primary mt-3 px-4 py-2"
                onClick={() => setIsEditing(true)}
                style={{ borderRadius: "10px", fontWeight: "600" }}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;