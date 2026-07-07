import { HashRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Resources from "../pages/Resources";
import Circulation from "../pages/Circulation";
import Profile from "../pages/Profile";
import DigitalLibrary from "../pages/DigitalLibrary";
import BookManagement from "../pages/BookManagement";
import UserManagement from "../pages/UserManagement";
import IssueReturn from "../pages/IssueReturn";
import LibrarianDashboard from "../pages/LibrarianDashboard";
import AdminDashboard from "../pages/AdminDashboard";

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Login" element={<Login />} />

        <Route path="/resources" element={<Resources />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/circulation" element={<Circulation />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/digital-library" element={<DigitalLibrary />} />

        <Route path="/book-management" element={<BookManagement />} />

        <Route path="/user-management" element={<UserManagement />} />

        <Route path="/issue-return" element={<IssueReturn />} />

        <Route path="/librarian-dashboard" element={<LibrarianDashboard />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </HashRouter>
  );
}

export default AppRoutes;
 