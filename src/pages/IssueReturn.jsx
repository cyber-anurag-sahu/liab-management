import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import circulationService from "../services/circulationService";
import "../styles/issuereturn.css";

function IssueReturn() {
  const [transactions, setTransactions] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      const data = await circulationService.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleIssue = async () => {
    if (!studentId || !bookId) {
      alert("Please enter both Student ID and Book ID");
      return;
    }
    setActionLoading(true);
    try {
      await circulationService.issueBook(studentId, bookId);
      alert(`Book ID ${bookId} issued successfully to Student ${studentId}`);
      setBookId("");
      await fetchTransactions();
    } catch (err) {
      console.error("Error issuing book:", err);
      alert(err.message || "Failed to issue book");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!studentId || !bookId) {
      alert("Please enter both Student ID and Book ID");
      return;
    }
    setActionLoading(true);
    try {
      await circulationService.returnBook(studentId, bookId);
      alert(`Book ID ${bookId} returned successfully from Student ${studentId}`);
      setBookId("");
      await fetchTransactions();
    } catch (err) {
      console.error("Error returning book:", err);
      alert(err.message || "Failed to return book");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <MainLayout>

      <div className="issue-return-container">

        <h2>📖 Issue & Return Books</h2>

        <div className="issue-form">

          <input
            type="text"
            placeholder="Student ID (e.g. MCA001)"
            className="form-control"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          <input
            type="text"
            placeholder="Book ID (e.g. 1)"
            className="form-control"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
          />

          <button 
            className="issue-btn" 
            onClick={handleIssue}
            disabled={actionLoading}
          >
            {actionLoading ? "Processing..." : "Issue Book"}
          </button>

          <button 
            className="return-btn" 
            onClick={handleReturn}
            disabled={actionLoading}
          >
            {actionLoading ? "Processing..." : "Return Book"}
          </button>

        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading Transactions Records...</p>
          </div>
        ) : (
          <div className="records-table">

            <table className="table">

              <thead>
                <tr>
                  <th>Tx ID</th>
                  <th>Student ID</th>
                  <th>Book</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Fine</th>
                </tr>
              </thead>

              <tbody>

                {transactions.map((transaction) => (

                  <tr key={transaction.id}>

                    <td>#{transaction.id}</td>

                    <td>{transaction.student_id}</td>

                    <td>{transaction.book_title}</td>

                    <td>{transaction.issue_date}</td>

                    <td>{transaction.due_date}</td>

                    <td>
                      <span className={`badge ${
                        transaction.status === "Returned" ? "bg-success" :
                        transaction.status === "Overdue" ? "bg-danger" : "bg-warning text-dark"
                      }`}>
                        {transaction.status}
                      </span>
                    </td>

                    <td>₹{transaction.fine || 0}</td>

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

export default IssueReturn;