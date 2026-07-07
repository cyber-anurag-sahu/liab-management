import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const serviceAccountPath = "./serviceAccountKey.json";
const resolvedServiceAccountPath = path.resolve(serviceAccountPath);

if (!fs.existsSync(resolvedServiceAccountPath)) {
  console.error("❌ Error: serviceAccountKey.json not found in backend directory.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(resolvedServiceAccountPath, "utf8"));
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// Helper to clear existing collections before seeding
async function deleteCollection(collectionPath) {
  const collectionRef = db.collection(collectionPath);
  const snapshot = await collectionRef.get();
  if (snapshot.empty) return;

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log(`🧹 Cleared collection: ${collectionPath}`);
}

// ----------------------------------------------------
// 1. DATA GENERATION: USERS
// ----------------------------------------------------
const baseUsers = [
  { id: 1, student_id: "MCA001", name: "Snehasri Pati", email: "snehasri@openshelf.com", role: "Student", department: "MCA" },
  { id: 2, student_id: "MCA002", name: "Amit Sharma", email: "amit@openshelf.com", role: "Student", department: "MCA" },
  { id: 3, student_id: "MCA003", name: "Pooja Patel", email: "pooja@openshelf.com", role: "Student", department: "MCA" },
  { id: 4, student_id: "FAC001", name: "Ananya Das", email: "ananya@openshelf.com", role: "Faculty", department: "CSE" },
  { id: 5, student_id: "LIB001", name: "Rahul Kumar", email: "rahul@openshelf.com", role: "Librarian", department: "Library" },
  { id: 6, student_id: "ADM001", name: "Admin User", email: "admin@openshelf.com", role: "Admin", department: "Administration" }
];

const firstNames = ["Rajesh", "Priya", "Vikram", "Neha", "Arjun", "Aditi", "Rohan", "Meera", "Karan", "Deepika", "Sanjay", "Anjali", "Varun", "Kriti", "Vijay", "Divya", "Rahul", "Swati", "Abhishek", "Ritu", "Manish", "Shreya", "Alok", "Nisha", "Gaurav", "Komal", "Sunil", "Rani", "Manoj", "Jyoti", "Aakash", "Poonam", "Ravi", "Kiran"];
const lastNames = ["Kumar", "Sharma", "Singh", "Patel", "Das", "Joshi", "Verma", "Gupta", "Sen", "Nair", "Reddy", "Choudhury", "Mehta", "Iyer", "Rao", "Mishra", "Pandey", "Bose", "Roy", "Dubey", "Gill", "Menon", "Jha", "Kaur"];
const departments = ["MCA", "CSE", "ECE", "Mechanical", "Civil", "Electrical"];

const mockUsers = [...baseUsers];
for (let i = 7; i <= 50; i++) {
  const fName = firstNames[i % firstNames.length];
  const lName = lastNames[(i * 3) % lastNames.length];
  const name = `${fName} ${lName}`;
  const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@openshelf.com`;
  const dept = departments[i % departments.length];
  
  let role = "Student";
  let student_id = `${dept}${100 + i}`;
  if (i % 7 === 0) {
    role = "Faculty";
    student_id = `FAC${100 + i}`;
  }
  
  mockUsers.push({
    id: i,
    student_id,
    name,
    email,
    role,
    department: dept
  });
}

// ----------------------------------------------------
// 2. DATA GENERATION: BOOKS
// ----------------------------------------------------
const baseBooks = [
  { id: 1, title: "Clean Code", author: "Robert Martin", category: "Programming", status: "Available", image_url: "https://images-na.ssl-images-amazon.com/images/I/41xShCOK5mL._SX379_BO1,204,203,200_.jpg" },
  { id: 2, title: "Computer Networks", author: "Forouzan", category: "Networking", status: "Available", image_url: "https://images-na.ssl-images-amazon.com/images/I/51-P-H3r6FL._SX383_BO1,204,203,200_.jpg" },
  { id: 3, title: "Database System Concepts", author: "Korth", category: "Database", status: "Issued", image_url: "https://images-na.ssl-images-amazon.com/images/I/51%2B1eT1rYxL._SX384_BO1,204,203,200_.jpg" },
  { id: 4, title: "Java Complete Reference", author: "Herbert Schildt", category: "Programming", status: "Available", image_url: "https://images-na.ssl-images-amazon.com/images/I/514mS%2B2aP1L._SX382_BO1,204,203,200_.jpg" }
];

const bookTemplates = [
  { title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "Programming" },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", category: "Programming" },
  { title: "Design Patterns", author: "Erich Gamma", category: "Programming" },
  { title: "Eloquent JavaScript", author: "Marijn Haverbeke", category: "Programming" },
  { title: "You Don't Know JS", author: "Kyle Simpson", category: "Programming" },
  { title: "Python Crash Course", author: "Eric Matthes", category: "Programming" },
  { title: "Computer Networking: A Top-Down Approach", author: "James Kurose", category: "Networking" },
  { title: "TCP/IP Illustrated", author: "W. Richard Stevens", category: "Networking" },
  { title: "Network Security Essentials", author: "William Stallings", category: "Networking" },
  { title: "Fundamentals of Database Systems", author: "Ramez Elmasri", category: "Database" },
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", category: "Database" },
  { title: "SQL Queries for Mere Mortals", author: "John L. Viescas", category: "Database" },
  { title: "Operating System Concepts", author: "Abraham Silberschatz", category: "Operating Systems" },
  { title: "Modern Operating Systems", author: "Andrew S. Tanenbaum", category: "Operating Systems" },
  { title: "Operating Systems: Three Easy Pieces", author: "Remzi Arpaci-Dusseau", category: "Operating Systems" },
  { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", category: "Artificial Intelligence" },
  { title: "Hands-On Machine Learning", author: "Aurélien Géron", category: "Artificial Intelligence" },
  { title: "Deep Learning", author: "Ian Goodfellow", category: "Artificial Intelligence" },
  { title: "Pattern Recognition and Machine Learning", author: "Christopher Bishop", category: "Artificial Intelligence" },
  { title: "The Web Application Hacker's Handbook", author: "Dafydd Stuttard", category: "Cybersecurity" },
  { title: "CompTIA Security+ Guide", author: "Mark Ciampa", category: "Cybersecurity" },
  { title: "Practical Malware Analysis", author: "Michael Sikorski", category: "Cybersecurity" },
  { title: "Cloud Computing Architecture", author: "Thomas Erl", category: "Cloud Computing" },
  { title: "Architecting the Cloud", author: "Michael J. Kavis", category: "Cloud Computing" },
  { title: "Concrete Mathematics", author: "Ronald Graham", category: "Mathematics" },
  { title: "Linear Algebra and Its Applications", author: "Gilbert Strang", category: "Mathematics" },
  { title: "Introduction to Probability", author: "Dimitri Bertsekas", category: "Mathematics" },
  { title: "The C Programming Language", author: "Brian Kernighan", category: "Programming" },
  { title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", category: "Programming" },
  { title: "Compilers: Principles, Techniques, and Tools", author: "Alfred Aho", category: "Programming" },
  { title: "Software Engineering", author: "Ian Sommerville", category: "Programming" },
  { title: "Distributed Systems: Principles and Paradigms", author: "Andrew S. Tanenbaum", category: "Networking" },
  { title: "Computer Architecture: A Quantitative Approach", author: "John L. Hennessy", category: "Networking" },
  { title: "NoSQL Distilled", author: "Pramod J. Sadalage", category: "Database" },
  { title: "Database Systems: The Complete Book", author: "Hector Garcia-Molina", category: "Database" },
  { title: "The Design of the UNIX Operating System", author: "Maurice J. Bach", category: "Operating Systems" },
  { title: "Linux Kernel Development", author: "Robert Love", category: "Operating Systems" },
  { title: "Introduction to Machine Learning with Python", author: "Andreas C. Müller", category: "Artificial Intelligence" },
  { title: "Mathematics for Machine Learning", author: "Marc Peter Deisenroth", category: "Mathematics" },
  { title: "Hacking: The Art of Exploitation", author: "Jon Erickson", category: "Cybersecurity" },
  { title: "Cryptography and Network Security", author: "William Stallings", category: "Cybersecurity" },
  { title: "Cloud Security and Privacy", author: "Tim Mather", category: "Cloud Computing" },
  { title: "Discrete Mathematics and Its Applications", author: "Kenneth Rosen", category: "Mathematics" },
  { title: "Calculus", author: "Michael Spivak", category: "Mathematics" }
];

const mockBooks = [...baseBooks];
const sampleImages = [
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=300&auto=format&fit=crop"
];

bookTemplates.forEach((template, index) => {
  const id = baseBooks.length + index + 1;
  const status = index % 5 === 0 ? "Issued" : (index % 12 === 0 ? "Overdue" : "Available");
  const imgUrl = sampleImages[index % sampleImages.length];

  mockBooks.push({
    id,
    title: template.title,
    author: template.author,
    category: template.category,
    status,
    image_url: imgUrl
  });
});

// ----------------------------------------------------
// 3. DATA GENERATION: DIGITAL RESOURCES
// ----------------------------------------------------
const resourceTitles = [
  { title: "Advanced Database Architectures", author: "Dr. A. K. Sen", type: "Research Paper" },
  { title: "Wireless Ad-Hoc Networks in Smart Cities", author: "Prof. S. R. Nair", type: "Journal" },
  { title: "Design Patterns in Modern Python Projects", author: "Guido Rossum", type: "E-Book" },
  { title: "Next-Generation Cryptographic Standards", author: "Alice & Bob", type: "Research Paper" },
  { title: "Deep Learning Optimization on Edge Devices", author: "Dr. Karen Simonyan", type: "Thesis" },
  { title: "Distributed Consensus Algorithms: A Comparative Study", author: "Leslie Lamport", type: "Research Paper" },
  { title: "Analysis of Software-Defined Networks", author: "Cisco Research", type: "Journal" },
  { title: "Introduction to Quantum Computing Concepts", author: "David Deutsch", type: "E-Book" },
  { title: "Implementing High-Availability SQL Servers", author: "Microsoft Press", type: "E-Book" },
  { title: "A Study on Cybersecurity Threats in IoT Systems", author: "Bruce Schneier", type: "Thesis" },
  { title: "Performance Analysis of Microservices Architecture", author: "Martin Fowler", type: "Research Paper" },
  { title: "Reinforcement Learning for Robotic Hand Control", author: "OpenAI Labs", type: "Journal" },
  { title: "Scaling Web Servers to Millions of Connections", author: "Nginx Core Team", type: "E-Book" },
  { title: "Compiler Optimization Techniques for Multi-Core CPUs", author: "Intel Compiler Lab", type: "Thesis" },
  { title: "Blockchain-Based Digital Identity Management", author: "Satoshi Nakamoto", type: "Research Paper" }
];

const mockDigitalResources = [];
let resId = 1;
for (const dept of departments) {
  for (let j = 0; j < 5; j++) {
    const template = resourceTitles[(resId - 1) % resourceTitles.length];
    mockDigitalResources.push({
      id: resId,
      title: `${template.title} (Vol. ${j + 1})`,
      author: template.author,
      department: dept,
      type: template.type,
      file_url: "#"
    });
    resId++;
  }
}

// ----------------------------------------------------
// 4. DATA GENERATION: TRANSACTIONS
// ----------------------------------------------------
const mockTransactions = [
  { id: 1, student_id: "MCA001", book_id: 1, issue_date: "2026-06-14", due_date: "2026-06-28", status: "Issued", fine: 0 },
  { id: 2, student_id: "MCA002", book_id: 4, issue_date: "2026-06-10", due_date: "2026-06-24", status: "Returned", fine: 0 },
  { id: 3, student_id: "MCA003", book_id: 3, issue_date: "2026-06-05", due_date: "2026-06-19", status: "Overdue", fine: 50 }
];

// Generate additional transactions dynamically
const students = mockUsers.filter(u => u.role === "Student");
const issuedBooks = mockBooks.filter(b => b.status === "Issued" || b.status === "Overdue");

issuedBooks.forEach((book, index) => {
  // Check if book already has a manual transaction in mockTransactions
  if (mockTransactions.some(t => t.book_id === book.id)) return;

  const student = students[index % students.length];
  const txId = mockTransactions.length + 1;
  const status = book.status;
  
  // Create realistic dates
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - (10 + index));
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 14);
  
  let fine = 0;
  if (status === "Overdue") {
    fine = 30 + (index * 10);
  }

  const formatDate = (d) => d.toISOString().split('T')[0];

  mockTransactions.push({
    id: txId,
    student_id: student.student_id,
    book_id: book.id,
    issue_date: formatDate(issueDate),
    due_date: formatDate(dueDate),
    status: status,
    fine: fine
  });
});

// Also create some historically "Returned" transactions
for (let k = 0; k < 15; k++) {
  const student = students[(k * 3) % students.length];
  const book = mockBooks[(k * 2) % mockBooks.length];
  
  // Make sure we don't conflict with current active issues
  if (mockTransactions.some(t => t.book_id === book.id && (t.status === "Issued" || t.status === "Overdue"))) {
    continue;
  }

  const txId = mockTransactions.length + 1;
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - (40 + k));
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 14);

  const formatDate = (d) => d.toISOString().split('T')[0];

  mockTransactions.push({
    id: txId,
    student_id: student.student_id,
    book_id: book.id,
    issue_date: formatDate(issueDate),
    due_date: formatDate(dueDate),
    status: "Returned",
    fine: 0
  });
}

// ----------------------------------------------------
// SEEDING EXECUTION
// ----------------------------------------------------
async function seed() {
  console.log("🌱 Starting Firestore Seeding process with high-volume mock data...");
  
  // Clear old collections to keep database clean and uniform
  await deleteCollection("users");
  await deleteCollection("books");
  await deleteCollection("digital_resources");
  await deleteCollection("transactions");

  console.log(`\nGenerated dataset sizes:`);
  console.log(`- Users: ${mockUsers.length}`);
  console.log(`- Books: ${mockBooks.length}`);
  console.log(`- Digital Resources: ${mockDigitalResources.length}`);
  console.log(`- Transactions: ${mockTransactions.length}`);

  // 1. Seed Users
  console.log("\nSeeding users...");
  const userChunks = [];
  for (let i = 0; i < mockUsers.length; i += 10) {
    userChunks.push(mockUsers.slice(i, i + 10));
  }
  for (const chunk of userChunks) {
    const batch = db.batch();
    chunk.forEach(user => {
      batch.set(db.collection("users").doc(user.id.toString()), user);
    });
    await batch.commit();
  }
  console.log("✅ Users seeded!");
  
  // 2. Seed Books
  console.log("Seeding books...");
  const bookChunks = [];
  for (let i = 0; i < mockBooks.length; i += 10) {
    bookChunks.push(mockBooks.slice(i, i + 10));
  }
  for (const chunk of bookChunks) {
    const batch = db.batch();
    chunk.forEach(book => {
      batch.set(db.collection("books").doc(book.id.toString()), book);
    });
    await batch.commit();
  }
  console.log("✅ Books seeded!");

  // 3. Seed Digital Resources
  console.log("Seeding digital resources...");
  const resChunks = [];
  for (let i = 0; i < mockDigitalResources.length; i += 10) {
    resChunks.push(mockDigitalResources.slice(i, i + 10));
  }
  for (const chunk of resChunks) {
    const batch = db.batch();
    chunk.forEach(resource => {
      batch.set(db.collection("digital_resources").doc(resource.id.toString()), resource);
    });
    await batch.commit();
  }
  console.log("✅ Digital resources seeded!");

  // 4. Seed Transactions
  console.log("Seeding transactions...");
  const txChunks = [];
  for (let i = 0; i < mockTransactions.length; i += 10) {
    txChunks.push(mockTransactions.slice(i, i + 10));
  }
  for (const chunk of txChunks) {
    const batch = db.batch();
    chunk.forEach(tx => {
      batch.set(db.collection("transactions").doc(tx.id.toString()), tx);
    });
    await batch.commit();
  }
  console.log("✅ Transactions seeded!");

  console.log("\n🎉 Firestore Database seeded successfully with a lot of data!");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Seeding failed:", err.message);
  process.exit(1);
});
