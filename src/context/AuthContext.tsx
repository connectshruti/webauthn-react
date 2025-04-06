import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, registerUser, logoutUser, getUserProfile } from "../services/userServices.ts";
import { loginWithPasskey, verifyLoginWithPasskey } from "../services/passkeyServices.ts";
interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    loginWithPasskey: (email: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

// Create AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    

      // Fetch user on page load (using cookie-based authentication)
      useEffect(() => {
        const fetchUser = async () => {
            const data = await getUserProfile(); // ✅ Backend should validate session via cookies
            if (data?.success && data.user) {

                setUser(data.user);
            } else {
                setUser(null);
            }
        };
        fetchUser();
    }, [user]);

     // Function to login user with email/password
     const login = async (email: string, password: string) => {
        const data = await loginUser(email, password);
        console.log("Login Response:", data);
        if (data?.success && data.user) {
            setUser(data.user); // ✅ Only update user, no token storage needed
        } else {
            alert(data?.message || "Login failed");
        }
    };
// Function to decode base64url to ArrayBuffer
const base64urlDecode = (base64url: string): ArrayBuffer => {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
};

    // Function to login with passkey
    const loginWithPasskeyHandler = async (email: string) => {
        try {
            const options = await loginWithPasskey(email);
            if (!options || !options.challenge) {
                alert("Passkey login failed: " + (options?.message || "Invalid challenge"));
                return;
            }
    // ✅ Convert challenge to ArrayBuffer
    options.challenge = base64urlDecode(options.challenge);

    // ✅ Convert allowCredentials IDs to ArrayBuffer
    if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map((cred) => ({
            id: base64urlDecode(cred.id),  // Convert to ArrayBuffer
            transports: cred.transports || [],
            type: "public-key"
        }));
    }
    console.log("options: ",options)

            const credential = await navigator.credentials.get({ publicKey: options });
            if (!credential) {
                alert("Passkey authentication failed.");
                return;
            }
            console.log("Credential:", credential);
    
            const response = await verifyLoginWithPasskey(credential);
            console.log("response: ",response)
            if (response?.success && response.user) {
                setUser(response.user); // ✅ Only update user, no token storage needed
            } else {
                alert(response?.message || "Passkey login failed");
            }
        } catch (error) {
            console.error("Passkey login error:", error);
            alert("An error occurred during passkey authentication.");
        }
    };

      //  Register User (Fix: Auto-login after registration)
      const register = async (name: string, email: string, password: string) => {
        const data = await registerUser(name, email, password);
        console.log("Registration Response:", data);
        if (data?.success) {
            // After successful registration, redirect to login page
            alert("Registration successful! Please log in.");
        } else {
            alert(data?.message || "Registration failed");
        }
    };

       // ✅ Logout Function (Fix: Remove token)
       const logout = async () => {
        await logoutUser();
        setUser(null); // ✅ Just clear user state, no need for `localStorage.removeItem("token")`
    };

 
    return (
        <AuthContext.Provider value={{ user, login, loginWithPasskey: loginWithPasskeyHandler, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};