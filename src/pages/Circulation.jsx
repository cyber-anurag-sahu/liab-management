import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import circulationService from "../services/circulationService";
import "../styles/circulation.css";

function Circulation() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchTransactions();
  }, []);

  const borrowedBooks = transactions.filter(
    (book) => book.status === "Issued"
  );

  const overdueBooks = transactions.filter(
    (book) => book.status === "Overdue"
  );

  return (
    <MainLayout>

      <div className="circulation-container">

        <h2>📖 Circulation Management</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading Circulation History...</p>
          </div>
        ) : (
          <>
            <div className="stats-row">

              <div className="stat-card">
                <h4>Borrowed Books</h4>
                <h2>{borrowedBooks.length}</h2>
              </div>

              <div className="stat-card">
                <h4>Overdue Books</h4>
                <h2>{overdueBooks.length}</h2>
              </div>

              <div className="stat-card">
                <h4>Total Fine</h4>
                <h2>
                  ₹
                  {transactions.reduce(
                    (sum, item) => sum + (item.fine || 0),
                    0
                  )}
                </h2>
              </div>

            </div>

            <div className="table-section">

              <table className="table table-striped">

                <thead>

                  <tr>
                    <th>Transaction ID</th>
                    <th>User ID</th>
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
          </>
        )}

      </div>

    </MainLayout>
  );
}

export default Circulation;