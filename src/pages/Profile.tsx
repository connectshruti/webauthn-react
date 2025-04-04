import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 🚀 Redirect if not authenticated
import { getUserProfile } from "../services/userServices.ts";
import { useAuth } from "../context/AuthContext.tsx"; // Use AuthContext for logout

const Profile = () => {
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { logout } = useAuth(); // Logout function from AuthContext

 useEffect(() => {
        const fetchProfile = async () => {
            const response = await getUserProfile();
            console.log(response);
            if (response.success) {
                setUser(response.user);
            } else {
                setError(response.message);
                navigate("/auth/login"); // 🚀 Redirect to login if not authenticated
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = async () => {
        logout(); // Clear authentication state
        navigate("/auth/login"); // Redirect to login
    };
    return (
        <div>
        <h2>Profile</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {user ? (
            <div>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                
                {/* 🚀 Logout button */}
                <button onClick={handleLogout} style={{ marginTop: "10px" }}>Logout</button>

                {/* 🚀 Passkey Authentication */}
                <button onClick={() => navigate("/auth/passkey")} style={{ marginLeft: "10px" }}>
                    Login with Passkey
                </button>
            </div>
        ) : (
            <p>Loading...</p>
        )}
    </div>
    );
};

export default Profile;