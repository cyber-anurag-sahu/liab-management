import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
let db = null;
let isMocked = true;

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceAccountKey.json";
const resolvedServiceAccountPath = path.resolve(serviceAccountPath);

if (fs.existsSync(resolvedServiceAccountPath)) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(resolvedServiceAccountPath, "utf8"));
    initializeApp({
      credential: cert(serviceAccount)
    });
    db = getFirestore();
    isMocked = false;
    console.log("🔌 Connected to Firebase Firestore database successfully.");
  } catch (error) {
    console.error("❌ Failed to connect to Firebase Firestore:", error.message);
    console.log("⚠️ Running in Mock Data Mode fallback.");
  }
} else {
  console.log("⚠️ Firebase serviceAccountKey.json not found.");
  console.log("⚠️ Running in Mock Data Mode fallback. Place serviceAccountKey.json in the backend folder to use Firebase.");
}


// ==========================================
// MOCK DATA STORAGE (Fallback Mode)
// ==========================================
let mockUsers = [
  { id: 1, student_id: "MCA001", name: "Snehasri Pati", email: "snehasri@openshelf.com", role: "Student", department: "MCA" },
  { id: 2, student_id: "MCA002", name: "Amit Sharma", email: "amit@openshelf.com", role: "Student", department: "MCA" },
  { id: 3, student_id: "MCA003", name: "Pooja Patel", email: "pooja@openshelf.com", role: "Student", department: "MCA" },
  { id: 4, student_id: "FAC001", name: "Ananya Das", email: "ananya@openshelf.com", role: "Faculty", department: "CSE" },
  { id: 5, student_id: "LIB001", name: "Rahul Kumar", email: "rahul@openshelf.com", role: "Librarian", department: "Library" },
  { id: 6, student_id: "ADM001", name: "Admin User", email: "admin@openshelf.com", role: "Admin", department: "Administration" }
];

let mockBooks = [
  { id: 1, title: "Clean Code", author: "Robert Martin", category: "Programming", status: "Available", image_url: "https://images-na.ssl-images-amazon.com/images/I/41xShCOK5mL._SX379_BO1,204,203,200_.jpg" },
  { id: 2, title: "Computer Networks", author: "Forouzan", category: "Networking", status: "Available", image_url: "https://images-na.ssl-images-amazon.com/images/I/51-P-H3r6FL._SX383_BO1,204,203,200_.jpg" },
  { id: 3, title: "Database System Concepts", author: "Korth", category: "Database", status: "Issued", image_url: "https://images-na.ssl-images-amazon.com/images/I/51%2B1eT1rYxL._SX384_BO1,204,203,200_.jpg" },
  { id: 4, title: "Java Complete Reference", author: "Herbert Schildt", category: "Programming", status: "Available", image_url: "https://images-na.ssl-images-amazon.com/images/I/514mS%2B2aP1L._SX382_BO1,204,203,200_.jpg" }
];

let mockDigitalResources = [
  { id: 1, title: "Database Management System", author: "Korth", department: "CSE", type: "E-Book", file_url: "#" },
  { id: 2, title: "Computer Networks", author: "Forouzan", department: "CSE", type: "E-Book", file_url: "#" },
  { id: 3, title: "Thermodynamics", author: "P.K. Nag", department: "CSE", type: "E-Book", file_url: "#" },
  { id: 4, title: "Machine Design", author: "R.S. Khurmi", department: "ECE", type: "Journal", file_url: "#" },
  { id: 5, title: "Digital Electronics", author: "Morris Mano", department: "ECE", type: "E-Book", file_url: "#" },
  { id: 6, title: "Structural Analysis", author: "R.C. Hibbeler", department: "Civil", type: "Research Paper", file_url: "#" }
];

let mockTransactions = [
  { id: 1, student_id: "MCA001", book_id: 1, book_title: "Clean Code", issue_date: "2026-06-14", due_date: "2026-06-28", status: "Issued", fine: 0 },
  { id: 2, student_id: "MCA002", book_id: 4, book_title: "Java Complete Reference", issue_date: "2026-06-10", due_date: "2026-06-24", status: "Returned", fine: 0 },
  { id: 3, student_id: "MCA003", book_id: 3, book_title: "Database System Concepts", issue_date: "2026-06-05", due_date: "2026-06-19", status: "Overdue", fine: 50 }
];

// Helper to format date (YYYY-MM-DD)
const formatDate = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

// Helper to parse numeric document IDs
const formatDocId = (docId) => {
  return isNaN(docId) ? docId : parseInt(docId);
};

// ==========================================
// API ROUTES
// ==========================================

// 1. AUTHENTICATION ROUTE
app.post("/api/auth/login", async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: "Email and role are required" });
  }

  if (isMocked) {
    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );
    if (user) {
      return res.json(user);
    }
    return res.status(401).json({ error: "Invalid credentials" });
  } else {
    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef
        .where("email", "==", email.toLowerCase())
        .where("role", "==", role)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const doc = snapshot.docs[0];
      const user = { id: formatDocId(doc.id), ...doc.data() };
      return res.json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

// 2. BOOKS ROUTES
app.get("/api/books", async (req, res) => {
  if (isMocked) {
    return res.json(mockBooks);
  } else {
    try {
      const booksRef = db.collection("books");
      const snapshot = await booksRef.orderBy("id", "asc").get();
      const books = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: data.id !== undefined ? data.id : formatDocId(doc.id), ...data };
      });
      return res.json(books);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

app.post("/api/books", async (req, res) => {
  const { title, author, category, image_url } = req.body;

  if (!title || !author || !category) {
    return res.status(400).json({ error: "Title, author, and category are required" });
  }

  const defaultImage = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2787&auto=format&fit=crop";

  if (isMocked) {
    const newBook = {
      id: mockBooks.length > 0 ? Math.max(...mockBooks.map((b) => b.id)) + 1 : 1,
      title,
      author,
      category,
      status: "Available",
      image_url: image_url || defaultImage
    };
    mockBooks.push(newBook);
    return res.status(201).json(newBook);
  } else {
    try {
      const booksRef = db.collection("books");
      const snapshot = await booksRef.orderBy("id", "desc").limit(1).get();
      let newId = 1;
      if (!snapshot.empty) {
        const maxId = snapshot.docs[0].data().id;
        if (typeof maxId === "number") {
          newId = maxId + 1;
        }
      }

      const newBook = {
        id: newId,
        title,
        author,
        category,
        status: "Available",
        image_url: image_url || defaultImage,
        created_at: new Date().toISOString()
      };

      await booksRef.doc(newId.toString()).set(newBook);
      return res.status(201).json(newBook);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

app.put("/api/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, category, status, image_url } = req.body;

  if (isMocked) {
    const bookIdx = mockBooks.findIndex((b) => b.id === parseInt(id));
    if (bookIdx === -1) return res.status(404).json({ error: "Book not found" });

    mockBooks[bookIdx] = {
      ...mockBooks[bookIdx],
      title: title !== undefined ? title : mockBooks[bookIdx].title,
      author: author !== undefined ? author : mockBooks[bookIdx].author,
      category: category !== undefined ? category : mockBooks[bookIdx].category,
      status: status !== undefined ? status : mockBooks[bookIdx].status,
      image_url: image_url !== undefined ? image_url : mockBooks[bookIdx].image_url
    };
    return res.json(mockBooks[bookIdx]);
  } else {
    try {
      const bookRef = db.collection("books").doc(id.toString());
      const doc = await bookRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Book not found" });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (author !== undefined) updateData.author = author;
      if (category !== undefined) updateData.category = category;
      if (status !== undefined) updateData.status = status;
      if (image_url !== undefined) updateData.image_url = image_url;

      await bookRef.update(updateData);
      const updatedDoc = await bookRef.get();
      return res.json({ id: formatDocId(id), ...updatedDoc.data() });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

app.delete("/api/books/:id", async (req, res) => {
  const { id } = req.params;

  if (isMocked) {
    const bookIdx = mockBooks.findIndex((b) => b.id === parseInt(id));
    if (bookIdx === -1) return res.status(404).json({ error: "Book not found" });

    mockBooks.splice(bookIdx, 1);
    return res.json({ message: "Book deleted successfully" });
  } else {
    try {
      const bookRef = db.collection("books").doc(id.toString());
      const doc = await bookRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Book not found" });
      }
      await bookRef.delete();
      return res.json({ message: "Book deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

// 3. USERS ROUTES
app.get("/api/users", async (req, res) => {
  if (isMocked) {
    return res.json(mockUsers);
  } else {
    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.orderBy("id", "asc").get();
      const users = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: data.id !== undefined ? data.id : formatDocId(doc.id), ...data };
      });
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

app.post("/api/users", async (req, res) => {
  const { student_id, name, email, role, department } = req.body;

  if (!student_id || !name || !email || !role || !department) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (isMocked) {
    const newIdx = mockUsers.length > 0 ? Math.max(...mockUsers.map((u) => u.id)) + 1 : 1;
    const newUser = { id: newIdx, student_id, name, email, role, department };
    mockUsers.push(newUser);
    return res.status(201).json(newUser);
  } else {
    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.orderBy("id", "desc").limit(1).get();
      let newId = 1;
      if (!snapshot.empty) {
        const maxId = snapshot.docs[0].data().id;
        if (typeof maxId === "number") {
          newId = maxId + 1;
        }
      }

      const newUser = {
        id: newId,
        student_id,
        name,
        email,
        role,
        department,
        created_at: new Date().toISOString()
      };

      await usersRef.doc(newId.toString()).set(newUser);
      return res.status(201).json(newUser);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { student_id, name, email, role, department } = req.body;

  if (isMocked) {
    const userIdx = mockUsers.findIndex((u) => u.id === parseInt(id));
    if (userIdx === -1) return res.status(404).json({ error: "User not found" });

    mockUsers[userIdx] = {
      ...mockUsers[userIdx],
      student_id: student_id !== undefined ? student_id : mockUsers[userIdx].student_id,
      name: name !== undefined ? name : mockUsers[userIdx].name,
      email: email !== undefined ? email : mockUsers[userIdx].email,
      role: role !== undefined ? role : mockUsers[userIdx].role,
      department: department !== undefined ? department : mockUsers[userIdx].department
    };
    return res.json(mockUsers[userIdx]);
  } else {
    try {
      const userRef = db.collection("users").doc(id.toString());
      const doc = await userRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "User not found" });
      }

      const updateData = {};
      if (student_id !== undefined) updateData.student_id = student_id;
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (role !== undefined) updateData.role = role;
      if (department !== undefined) updateData.department = department;

      await userRef.update(updateData);
      const updatedDoc = await userRef.get();
      return res.json({ id: formatDocId(id), ...updatedDoc.data() });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  if (isMocked) {
    const userIdx = mockUsers.findIndex((u) => u.id === parseInt(id));
    if (userIdx === -1) return res.status(404).json({ error: "User not found" });

    mockUsers.splice(userIdx, 1);
    return res.json({ message: "User deleted successfully" });
  } else {
    try {
      const userRef = db.collection("users").doc(id.toString());
      const doc = await userRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "User not found" });
      }
      await userRef.delete();
      return res.json({ message: "User deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

// 4. CIRCULATION/TRANSACTIONS ROUTES
app.get("/api/circulation", async (req, res) => {
  if (isMocked) {
    return res.json(mockTransactions);
  } else {
    try {
      const transactionsRef = db.collection("transactions");
      const snapshot = await transactionsRef.orderBy("id", "asc").get();
      const transactions = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: data.id !== undefined ? data.id : formatDocId(doc.id), ...data };
      });

      // Join books data to fetch book titles
      const booksRef = db.collection("books");
      const booksSnapshot = await booksRef.get();
      const booksMap = {};
      booksSnapshot.docs.forEach(doc => {
        const data = doc.data();
        booksMap[data.id || doc.id] = data.title;
      });

      const formatted = transactions.map((t) => ({
        id: t.id,
        student_id: t.student_id,
        book_id: t.book_id,
        book_title: booksMap[t.book_id] || "Unknown Book",
        issue_date: t.issue_date,
        due_date: t.due_date,
        status: t.status,
        fine: t.fine
      }));

      return res.json(formatted);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

app.get("/api/circulation/stats", async (req, res) => {
  if (isMocked) {
    const borrowed = mockTransactions.filter((t) => t.status === "Issued").length;
    const overdue = mockTransactions.filter((t) => t.status === "Overdue").length;
    const totalFine = mockTransactions.reduce((sum, t) => sum + t.fine, 0);
    const totalBooks = mockBooks.length;
    const availableBooks = mockBooks.filter((b) => b.status === "Available").length;
    const activeUsers = mockUsers.length;
    const booksIssued = mockTransactions.filter((t) => t.status === "Issued" || t.status === "Overdue").length;

    return res.json({
      borrowedCount: borrowed,
      overdueCount: overdue,
      totalFine,
      totalBooks,
      availableBooks,
      activeUsers,
      booksIssued
    });
  } else {
    try {
      const txSnapshot = await db.collection("transactions").get();
      const bkSnapshot = await db.collection("books").get();
      const usSnapshot = await db.collection("users").get();

      const txs = txSnapshot.docs.map(doc => doc.data());
      const books = bkSnapshot.docs.map(doc => doc.data());

      const borrowed = txs.filter((t) => t.status === "Issued").length;
      const overdue = txs.filter((t) => t.status === "Overdue").length;
      const totalFine = txs.reduce((sum, t) => sum + (parseInt(t.fine) || 0), 0);
      const booksIssued = txs.filter((t) => t.status === "Issued" || t.status === "Overdue").length;

      return res.json({
        borrowedCount: borrowed,
        overdueCount: overdue,
        totalFine,
        totalBooks: bkSnapshot.size,
        availableBooks: books.filter((b) => b.status === "Available").length,
        activeUsers: usSnapshot.size,
        booksIssued
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

app.post("/api/circulation/issue", async (req, res) => {
  const { studentId, bookId } = req.body;

  if (!studentId || !bookId) {
    return res.status(400).json({ error: "studentId and bookId are required" });
  }

  if (isMocked) {
    const user = mockUsers.find((u) => u.student_id === studentId);
    if (!user) return res.status(404).json({ error: "Student not found" });

    const book = mockBooks.find((b) => b.id === parseInt(bookId));
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.status !== "Available") return res.status(400).json({ error: "Book is not available for issue" });

    book.status = "Issued";

    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + 14);

    const newTx = {
      id: mockTransactions.length > 0 ? Math.max(...mockTransactions.map((t) => t.id)) + 1 : 1,
      student_id: studentId,
      book_id: parseInt(bookId),
      book_title: book.title,
      issue_date: formatDate(issueDate),
      due_date: formatDate(dueDate),
      status: "Issued",
      fine: 0
    };
    mockTransactions.push(newTx);

    return res.status(201).json(newTx);
  } else {
    try {
      // 1. Verify Student
      const userRes = await db.collection("users").where("student_id", "==", studentId).limit(1).get();
      if (userRes.empty) {
        return res.status(404).json({ error: "Student ID not found in database" });
      }

      // 2. Verify Book
      const bookRef = db.collection("books").doc(bookId.toString());
      const bookDoc = await bookRef.get();
      if (!bookDoc.exists) {
        return res.status(404).json({ error: "Book not found" });
      }
      const book = bookDoc.data();
      if (book.status !== "Available") {
        return res.status(400).json({ error: "Book is not available for issue" });
      }

      // 3. Update Book Status to Issued
      await bookRef.update({ status: "Issued" });

      // 4. Create Transaction
      const issueDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(issueDate.getDate() + 14);

      const transactionsRef = db.collection("transactions");
      const txMaxSnapshot = await transactionsRef.orderBy("id", "desc").limit(1).get();
      let newTxId = 1;
      if (!txMaxSnapshot.empty) {
        const maxId = txMaxSnapshot.docs[0].data().id;
        if (typeof maxId === "number") {
          newTxId = maxId + 1;
        }
      }

      const transaction = {
        id: newTxId,
        student_id: studentId,
        book_id: parseInt(bookId),
        issue_date: formatDate(issueDate),
        due_date: formatDate(dueDate),
        status: "Issued",
        fine: 0,
        created_at: new Date().toISOString()
      };

      await transactionsRef.doc(newTxId.toString()).set(transaction);
      transaction.book_title = book.title;

      return res.status(201).json(transaction);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

app.post("/api/circulation/return", async (req, res) => {
  const { studentId, bookId } = req.body;

  if (!studentId || !bookId) {
    return res.status(400).json({ error: "studentId and bookId are required" });
  }

  if (isMocked) {
    const tx = mockTransactions.find(
      (t) => t.student_id === studentId && t.book_id === parseInt(bookId) && (t.status === "Issued" || t.status === "Overdue")
    );
    if (!tx) return res.status(404).json({ error: "No active issue record found for this student and book" });

    const book = mockBooks.find((b) => b.id === parseInt(bookId));
    if (book) book.status = "Available";

    tx.status = "Returned";
    
    return res.json(tx);
  } else {
    try {
      // 1. Find active transaction
      const txQuery = await db.collection("transactions")
        .where("student_id", "==", studentId)
        .where("book_id", "==", parseInt(bookId))
        .where("status", "in", ["Issued", "Overdue"])
        .get();

      if (txQuery.empty) {
        return res.status(404).json({ error: "No active issue transaction found for this student and book" });
      }

      // Pick the transaction with highest id (most recent)
      const txDoc = txQuery.docs.sort((a, b) => (b.data().id || 0) - (a.data().id || 0))[0];
      const txRef = txDoc.ref;

      // 2. Update Book Status to Available
      const bookRef = db.collection("books").doc(bookId.toString());
      await bookRef.update({ status: "Available" });

      // 3. Update Transaction to Returned
      await txRef.update({ status: "Returned" });

      const updatedDoc = await txRef.get();
      return res.json({ id: formatDocId(updatedDoc.id), ...updatedDoc.data() });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

// 5. DIGITAL RESOURCES ROUTES
app.get("/api/digital-resources", async (req, res) => {
  if (isMocked) {
    return res.json(mockDigitalResources);
  } else {
    try {
      const resRef = db.collection("digital_resources");
      const snapshot = await resRef.orderBy("id", "asc").get();
      const resources = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: data.id !== undefined ? data.id : formatDocId(doc.id), ...data };
      });
      return res.json(resources);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

app.get("/api/digital-resources/counts", async (req, res) => {
  if (isMocked) {
    const ebooks = mockDigitalResources.filter((r) => r.type === "E-Book").length;
    const journals = mockDigitalResources.filter((r) => r.type === "Journal").length;
    const papers = mockDigitalResources.filter((r) => r.type === "Research Paper").length;
    const thesis = mockDigitalResources.filter((r) => r.type === "Thesis").length;

    return res.json({ ebooks, journals, papers, thesis });
  } else {
    try {
      const resSnapshot = await db.collection("digital_resources").get();
      const data = resSnapshot.docs.map(doc => doc.data());

      const ebooks = data.filter((r) => r.type === "E-Book").length;
      const journals = data.filter((r) => r.type === "Journal").length;
      const papers = data.filter((r) => r.type === "Research Paper").length;
      const thesis = data.filter((r) => r.type === "Thesis").length;

      return res.json({ ebooks, journals, papers, thesis });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Express server running on port ${PORT}`);
});
