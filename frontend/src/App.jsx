import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/LoginPage";
import AdminPage from "./components/AdminPage";
import UserPage from "./components/UserPage";
import ProtectedRoute from "./components/ProtectRoutes";
import RegisterPage from "./components/RegisterPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Admin route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* User route */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
