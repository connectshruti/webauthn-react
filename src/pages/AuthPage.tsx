import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import Login from "./Login.tsx";
import PasskeyAuth from "./PasskeyAuth.tsx";

const AuthPage = () => {
  const [usePasskey, setUsePasskey] = useState(false);
  const { user } = useAuth();  // Get user state from AuthContext
  const navigate = useNavigate();

   // ✅ Redirect if user is already logged in
   useEffect(() => {
    if (user) {
        navigate("/");
    }
}, [user, navigate]);

    return (
      <div>
      <h1>Authentication</h1>
      {usePasskey ? <PasskeyAuth /> : <Login />}
      <button onClick={() => setUsePasskey(!usePasskey)}>
          {usePasskey ? "Use Password Login" : "Use Passkey Login"}
      </button>
  </div>
  
      );
    };
    
    export default AuthPage;
    