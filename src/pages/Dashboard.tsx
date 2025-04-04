import React from "react";
import { useAuth } from "../context/AuthContext.tsx"; // Get auth context
import { Link } from "react-router-dom";

 const Dashboard=()=>{
    const { user } = useAuth(); // Get user from AuthContext
    return (
        <div>
            <h2>Dashboard</h2>

            {user ? (
                <>
                    <p>Welcome, <strong>{user.name}</strong>!</p>
                    <p>Email: {user.email}</p>

                    {/* Logout Button */}
                    <Link to="/logout">
                        <button>Logout</button>
                    </Link>
                </>
            ) : (
                <>
                    <p>
                        This is the public dashboard. You can login using a password or passkey.
                    </p>
                    {/* Show login options */}
                    <Link to="/auth/login">
                        <button>Login with Password</button>
                    </Link>
                    <Link to="/auth/passkey" style={{ marginLeft: "10px" }}>
                        <button>Login with Passkey</button>
                    </Link>
                </>
            )}
        </div>
    );
}
export default Dashboard;