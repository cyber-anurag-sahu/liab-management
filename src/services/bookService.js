import api from "./api";

const bookService = {
  getBooks: async () => {
    try {
      const response = await api.get("/books");
      return response.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch books");
    }
  },

  addBook: async (bookData) => {
    try {
      const response = await api.post("/books", bookData);
      return response.data;
    } catch (error) {
      console.error("Error adding book:", error);
      throw new Error(error.response?.data?.error || "Failed to add book");
    }
  },

  updateBook: async (id, bookData) => {
    try {
      const response = await api.put(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      console.error("Error updating book:", error);
      throw new Error(error.response?.data?.error || "Failed to update book");
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting book:", error);
      throw new Error(error.response?.data?.error || "Failed to delete book");
    }
  },

  getDigitalResources: async () => {
    try {
      const response = await api.get("/digital-resources");
      return response.data;
    } catch (error) {
      console.error("Error fetching digital resources:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch digital resources");
    }
  },

  getDigitalResourcesCounts: async () => {
    try {
      const response = await api.get("/digital-resources/counts");
      return response.data;
    } catch (error) {
      console.error("Error fetching digital resources counts:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch digital resources counts");
    }
  }
};

export default bookService;
