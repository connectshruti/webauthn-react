const API_URL = `${process.env.REACT_APP_BACKEND}/api/passkey`;

// Register a new passkey
export const registerPasskey = async () => {
    try {
        const response = await fetch(`${API_URL}/register-passkey`, {
            method: "POST",
            credentials: "include"
        });
        const data = await response.json();
        return data.options ? data.options : data;
    } catch (error) {
        console.error("Error registering passkey: ", error);
        return { success: false, message: "Passkey registration failed" };
    }
};

// Verify passkey registration
export const verifyPasskey = async (credential: any) => {
    try {
        const response = await fetch(`${API_URL}/verify-register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // ✅ Uses cookies
            body: JSON.stringify({ credential }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error verifying passkey: ", error);
        return { success: false, message: "Passkey verification failed" };
    }
};

// Request login with passkey (Now takes email)
export const loginWithPasskey = async (email:string) => {
    try {
        const response = await fetch(`${API_URL}/login-passkey`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        console.log("Login options received at frontend:", data);
        console.log(data.options)
        return data.options ? data.options : data;
    } catch (error) {
        console.error("Error logging in with passkey: ", error);
        return { success: false, message: "Passkey login request failed" };
    }
};

// Verify passkey authentication
export const verifyLoginWithPasskey = async (credential: any) => {
    try {
        const response = await fetch(`${API_URL}/verify-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ credential })
        });
        console.log("response: ",response)
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error("Failed to parse JSON:", jsonError);
            return { success: false, message: "Invalid server response" };
        }

        return data;
    } catch (error) {
        console.error("Error verifying passkey authentication: ", error);
        return { success: false, message: "Passkey authentication failed" };
    }
};
