import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/userServices.ts";
import { useAuth } from "../context/AuthContext.tsx";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();  

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await registerUser(name, email, password);
        
        if (response.success) {
            // ✅ Auto-login after successful registration
            await login(email, password);
            navigate("/"); // Redirect to dashboard or home page
        } else {
            setError(response.message);
        }
    };

    return (
        <div>
        <h2>Register</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleRegister}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Register</button>
        </form>
    </div>
    );
};

export default Register;