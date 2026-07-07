import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Password is field input, but we authenticate using email & role for simplicity
  const [role, setRole] = useState("Student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await authService.login(email, role);
      
      if (user.role === "Admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "Librarian") {
        navigate("/librarian-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Invalid email or role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="container">
        <div className="row justify-content-center align-items-center vh-100">

          <div className="col-md-5">

            <div className="card shadow-lg border-0 login-card">

              <form className="card-body p-5" onSubmit={handleLogin}>

                <h2 className="text-center mb-2 title">
                  OpenShelf
                </h2>

                <p className="text-center text-muted mb-4">
                  Smart Library ERP System
                </p>

                {error && (
                  <div className="alert alert-danger text-center py-2" role="alert">
                    {error}
                  </div>
                )}

                <div className="mb-3">
                  <label>Email</label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email (e.g. admin@openshelf.com)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Password</label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label>Role</label>

                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option>Student</option>
                    <option>Faculty</option>
                    <option>Librarian</option>
                    <option>Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn login-btn w-100"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

              </form>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;