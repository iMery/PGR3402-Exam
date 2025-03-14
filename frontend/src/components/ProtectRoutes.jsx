import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const storedRole = localStorage.getItem("role");

  if (!storedRole || storedRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
