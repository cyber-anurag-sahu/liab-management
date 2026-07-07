import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import userService from "../services/userService";
import "../styles/usermanagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!studentId || !name || !email || !role) return;
    setActionLoading(true);

    // Auto-fill department if empty
    let dept = department;
    if (!dept) {
      if (role === "Student") dept = "MCA";
      else if (role === "Faculty") dept = "CSE";
      else if (role === "Librarian") dept = "Library";
      else dept = "Administration";
    }

    try {
      await userService.addUser({
        student_id: studentId,
        name,
        email,
        role,
        department: dept
      });
      setStudentId("");
      setName("");
      setEmail("");
      setDepartment("");
      setRole("Student");
      await fetchUsers();
    } catch (err) {
      console.error("Error adding user:", err);
      alert(err.message || "Failed to add user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setActionLoading(true);

    try {
      await userService.deleteUser(id);
      await fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>

      <div className="user-management">

        <h2>👥 User Management</h2>

        <input
          type="text"
          placeholder="Search Users..."
          className="form-control mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <form className="user-form" onSubmit={handleAddUser}>

          <input
            type="text"
            placeholder="User ID (e.g. MCA005)"
            className="form-control"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Full Name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Department (optional)"
            className="form-control"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <select 
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Student</option>
            <option>Faculty</option>
            <option>Librarian</option>
            <option>Admin</option>
          </select>

          <button type="submit" className="add-user-btn" disabled={actionLoading}>
            {actionLoading ? "Adding..." : "Add User"}
          </button>

        </form>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading Users List...</p>
          </div>
        ) : (
          <div className="user-table">

            <table className="table">

              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredUsers.map((user) => (
                  <tr key={user.id}>

                    <td>{user.student_id}</td>

                    <td>{user.name}</td>

                    <td>{user.email}</td>

                    <td>{user.department}</td>

                    <td>
                      <span className={`badge ${
                        user.role === "Admin" ? "bg-danger" : 
                        user.role === "Librarian" ? "bg-primary" : 
                        user.role === "Faculty" ? "bg-info text-dark" : "bg-secondary"
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td>

                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={actionLoading}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </MainLayout>
  );
}

export default UserManagement;