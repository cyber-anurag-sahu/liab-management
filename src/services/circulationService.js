import api from "./api";

const circulationService = {
  getTransactions: async () => {
    try {
      const response = await api.get("/circulation");
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch transactions");
    }
  },

  getStats: async () => {
    try {
      const response = await api.get("/circulation/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch statistics");
    }
  },

  issueBook: async (studentId, bookId) => {
    try {
      const response = await api.post("/circulation/issue", { studentId, bookId });
      return response.data;
    } catch (error) {
      console.error("Error issuing book:", error);
      throw new Error(error.response?.data?.error || "Failed to issue book");
    }
  },

  returnBook: async (studentId, bookId) => {
    try {
      const response = await api.post("/circulation/return", { studentId, bookId });
      return response.data;
    } catch (error) {
      console.error("Error returning book:", error);
      throw new Error(error.response?.data?.error || "Failed to return book");
    }
  }
};

export default circulationService;
