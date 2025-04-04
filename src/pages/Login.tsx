import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { loginUser } from "../services/userServices.ts";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();  // ✅ Get login function from AuthContext
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await loginUser(email, password);
        
        if (response.success && response.user) {
            login(email, password); // ✅ Update user state in AuthContext
            const from = location.state?.from?.pathname || "/profile"; // ✅ Redirect to last attempted page
            navigate(from);
        } else {
            setError(response.message);
        }
    };

    return (
        <div>
        <h2>Login with Password</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
        </form>
    </div>
    );
};

export default Login;