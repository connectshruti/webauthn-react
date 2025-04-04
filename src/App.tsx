import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import Profile from "./pages/Profile.tsx";
import Register from "./pages/Register.tsx";
import Logout from "./pages/Logout.tsx";
import Login from "./pages/Login.tsx";
import PasskeyAuth from "./pages/PasskeyAuth.tsx";
import Navbar from "./components/Navbar.tsx";
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

// Component to handle navigation inside the page
const PrivatePage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
      if (!user) navigate("/auth/login", { replace: true });
  }, [user, navigate]);

  return user ? <>{children}</> : null;
};


function App() {
  return (
    <AuthProvider>
    <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<Dashboard />} />  {/* Public Page */}
            <Route path="/auth/passkey" element={<PasskeyAuth />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />

            {/* Restrict pages inside component */}
            <Route path="/profile" element={<PrivatePage><Profile /></PrivatePage>} />
            <Route path="/logout" element={<PrivatePage><Logout /></PrivatePage>} />
        </Routes>
    </Router>
</AuthProvider>
  );
}

export default App;
