import React, { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { logoutUser } from "../services/userServices.ts";

const Logout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Use AuthContext logout function

   
    useLayoutEffect(() => {
        const performLogout = async () => {
            try {
                await logoutUser(); // Attempt to logout from backend
            } catch (error) {
                console.error("Logout failed:", error);
            }
            logout(); // ✅ Clear user session even if backend fails
            navigate("/auth/login"); // ✅ Redirect instantly
        };
        performLogout();
    }, [navigate, logout]);
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Logging you out...</h2>
            <p>Please wait while we safely log you out.</p>
        </div>
    );
};

export default Logout;
