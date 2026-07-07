import axios from "axios";

// Create Axios client instance pointing to our Node/Express backend API server
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
