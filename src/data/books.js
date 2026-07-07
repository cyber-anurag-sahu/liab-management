import cleanCode from "../assets/books/clean-code.jpg";
import computerNetworks from "../assets/books/computer-networks.jpg";
import databaseSystem from "../assets/books/database-system.jpg";

const books = [
  {
    id: 1,
    title: "Clean Code",
    author: "Robert Martin",
    category: "Programming",
    status: "Available",
    image: cleanCode
  },

  {
    id: 2,
    title: "Computer Networks",
    author: "Forouzan",
    category: "Networking",
    status: "Available",
    image: computerNetworks
  },

  {
    id: 3,
    title: "Database System Concepts",
    author: "Korth",
    category: "Database",
    status: "Issued",
    image: databaseSystem
  }
];

export default books;