import api from "./api";

const userService = {
  getUsers: async () => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch users");
    }
  },

  addUser: async (userData) => {
    try {
      const response = await api.post("/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error adding user:", error);
      throw new Error(error.response?.data?.error || "Failed to add user");
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error(error.response?.data?.error || "Failed to update user");
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error(error.response?.data?.error || "Failed to delete user");
    }
  }
};

export default userService;
