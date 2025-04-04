import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx"; // Ensure this is the correct path

const Navbar=()=>{
    const { user, logout } = useAuth();

    return(
        <nav>
        <Link to="/">Dashboard</Link>

        {user ? (
            <>
                <Link to="/profile">Profile</Link>
                <button onClick={logout}>Logout</button>
            </>
        ) : (
            <>
                <Link to="/auth/login">Login</Link>
                <Link to="/auth/register">Register</Link>
            </>
        )}
    </nav>
    )
}
export default Navbar;