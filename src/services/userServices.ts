const API_URL = `${process.env.REACT_APP_BACKEND}/api/user`;

//  Register a new user
export const registerUser = async (username: string, email: string, password: string) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
            credentials: "include" // Ensure cookies are sent
        });
        return await response.json();
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, message: "Registration failed" };
    }
};


//  Login user
export const loginUser = async (email: string, password: string) => {
  try {
      const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Ensures cookies are sent and received
          body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMessage = "Login failed. Please check your credentials.";
        try {
            const errorData = await response.json();
            errorMessage = errorData?.message || errorMessage;
        } catch (jsonError) {
            console.error("Error parsing login response:", jsonError);
        }
        return { success: false, message: errorMessage };
    }

    return await response.json(); // Successful login
  } catch (error) {
    console.error("Login request error:", error);
    return { success: false, message: "Login failed due to a network issue." };
  }
};


//  Logout user
export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        console.warn("Logout may not have completed successfully.");
    }
  } catch (error) {
    console.error("Logout request error:", error);
      alert("Logout failed");
  }
};


//  Get user profile (fetch authenticated user)
export const getUserProfile = async () => {
    try {
        const response = await fetch(`${API_URL}/profile`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            console.warn("Failed to fetch user profile.");
            return { success: false, message: "Failed to fetch user profile." };
        }

        return await response.json();
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return { success: false, message: "Failed to fetch user profile due to a network issue." };
      }
};