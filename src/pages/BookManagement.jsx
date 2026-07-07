import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import bookService from "../services/bookService";
import "../styles/bookmanagement.css";

function BookManagement() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      const data = await bookService.getBooks();
      setBooks(data);
    } catch (err) {
      console.error("Error loading books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!title || !author || !category) return;
    setActionLoading(true);

    try {
      await bookService.addBook({ title, author, category });
      setTitle("");
      setAuthor("");
      setCategory("");
      await fetchBooks();
    } catch (err) {
      console.error("Error adding book:", err);
      alert(err.message || "Failed to add book");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    setActionLoading(true);

    try {
      await bookService.deleteBook(id);
      await fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
      alert(err.message || "Failed to delete book");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title?.toLowerCase().includes(search.toLowerCase()) ||
    book.author?.toLowerCase().includes(search.toLowerCase()) ||
    book.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>

      <div className="book-management">

        <h2>📚 Book Management</h2>

        <input
          type="text"
          placeholder="Search by title, author or category..."
          className="form-control mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <form className="book-form" onSubmit={handleAddBook}>

          <input
            type="text"
            placeholder="Book Name"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Author"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Category"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <button type="submit" className="btn-add" disabled={actionLoading}>
            {actionLoading ? "Adding..." : "Add Book"}
          </button>

        </form>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading Books Catalog...</p>
          </div>
        ) : (
          <div className="book-table">

            <table className="table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredBooks.map((book) => (
                  <tr key={book.id}>

                    <td>#{book.id}</td>

                    <td>{book.title}</td>

                    <td>{book.author}</td>

                    <td>{book.category}</td>

                    <td>
                      <span className={`badge ${book.status === "Available" ? "bg-success" : "bg-warning"}`}>
                        {book.status}
                      </span>
                    </td>

                    <td>

                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteBook(book.id)}
                        disabled={actionLoading}
                        style={{ marginLeft: "5px" }}
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

export default BookManagement;