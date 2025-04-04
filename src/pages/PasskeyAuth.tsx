import React, { useState }  from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { registerPasskey, verifyPasskey, loginWithPasskey, verifyLoginWithPasskey } from "../services/passkeyServices.ts";

/// Function to decode base64url to ArrayBuffer
const base64urlDecode = (base64url: string): ArrayBuffer => {
  if (!base64url) {
    console.error("Error: base64urlDecode received undefined input");
    return new ArrayBuffer(0);
  }
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const PasskeyAuth = () => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(""); // Email state for login
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithPasskey } = useAuth(); 

  // Register Passkey
  const handleRegisterPasskey = async () => {
    const options = await registerPasskey();
    if (options) {
      console.log("options: ", options);
      try {
        options.challenge = base64urlDecode(options.challenge);
        options.user.id = base64urlDecode(options.user.id);
        options.excludeCredentials = options.excludeCredentials.map((cred) => ({
          id: base64urlDecode(cred.id), // Ensure it's an ArrayBuffer
          transports: cred.transports || [],
          type: "public-key",
        }));
        console.log("Updated excludeCredentials:", JSON.stringify(options.excludeCredentials, null, 2));

        // console.log("excludeCredentials[0].id type:", options.excludeCredentials[0].id.constructor.name);

        const credential = await navigator.credentials.create({ publicKey: options });
        
        if (credential) {
          await handleVerifyPasskey(credential);
        }

      } catch (error) {
        setMessage("Error creating credentials");
        console.error(error);
      }
    } else {
      setMessage("Passkey registration failed");
    }
  };

    // Handle verify Passkey
    const handleVerifyPasskey = async (credential: any) => {
      const response = await verifyPasskey(credential);
      setMessage(response.message);
      if (response.success) {
        navigate("/"); // Redirect to dashboard or home after success
      }
    };

  // Login with Passkey
  const handleLoginWithPasskey = async () => {
    if (!email) {
      setMessage("Please enter your email before logging in.");
      return;
    }

    const options = await loginWithPasskey(email); // Pass email to the backend for login
    console.log("Login options received:", options);

    if (!options || !options.challenge) {
      console.error("Error: Missing challenge in options", options);
      setMessage("Error: Missing challenge");
      return;
    }

    if (options) {
      try {
        options.challenge = base64urlDecode(options.challenge);
        
         // ✅ Convert allowCredentials IDs to ArrayBuffer
         if (options.allowCredentials) {
          options.allowCredentials = options.allowCredentials.map((cred) => ({
              id: base64urlDecode(cred.id),  // Convert to ArrayBuffer
              transports: cred.transports || [],
              type: "public-key"
          }));
      }

      console.log("Updated allowCredentials:", JSON.stringify(options.allowCredentials, null, 2));
 
        const credential = await navigator.credentials.get({ publicKey: options });
        if (credential) {
          await handleVerifyWithPasskey(credential);
        }
      } catch (error) {
        setMessage("Error getting credentials");
        console.error(error);
      }
    } else {
      setMessage("Passkey login request failed");
    }
  };

// Handle verify login with Passkey
const handleVerifyWithPasskey = async (credential: any) => {
  const response = await verifyLoginWithPasskey(credential);
  setMessage(response.message);
  if (response.success && response.user) {
    loginWithPasskey(email); // ✅ Update AuthContext state
      const from = location.state?.from?.pathname || "/"; // ✅ Redirect to last attempted page
      navigate(from);
  }
};

      
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Passkey Authentication</h2>

      <div style={{ marginBottom: "20px" }}>
        <p>Register a passkey without needing your email. This will allow you to authenticate with a passkey instead of using a password.</p>
        <button onClick={handleRegisterPasskey}>Register Passkey</button>
      </div>

      <div>
        <p><strong>Login with Passkey:</strong></p>
        <p>Enter your email to login using your registered passkey:</p>
        <input
          type="email"
          placeholder="Enter your email for login"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "10px", padding: "10px", width: "100%" }}
        />
        <button onClick={handleLoginWithPasskey}>Login with Passkey</button>
      </div>

      <p>{message}</p>
    </div>
      );
    };
    
    export default PasskeyAuth;