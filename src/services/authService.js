import api from "./api";

const authService = {
  login: async (email, role) => {
    try {
      const response = await api.post("/auth/login", { email, role });
      const user = response.data;
      
      // Store user details in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      
      return user;
    } catch (error) {
      console.error("Login error:", error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || "Login failed");
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  isAuthenticated: () => {
    return localStorage.getItem("role") !== null;
  }
};

export default authService;
