// API functions for authentication and user management
// Replace localStorage calls with actual API calls when backend is ready

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Register new user
export const registerUser = async (userData) => {
  try {
    // For now, store locally. Replace with actual API call:
    // const response = await fetch(`${API_BASE_URL}/auth/register`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(userData),
    // });
    // if (!response.ok) throw new Error("Registration failed");
    // return await response.json();

    // Local storage fallback
    localStorage.setItem("pm_user", JSON.stringify(userData));
    return { success: true, message: "User registered successfully" };
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
};

// Login user
export const loginUser = async (identifier, password) => {
  try {
    // Replace with actual API call:
    // const response = await fetch(`${API_BASE_URL}/auth/login`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ identifier, password }),
    // });
    // if (!response.ok) throw new Error("Login failed");
    // const data = await response.json();
    // localStorage.setItem("pm_token", data.token);
    // return data;

    // Local storage fallback
    const raw = localStorage.getItem("pm_user");
    if (!raw) throw new Error("No account found");

    const stored = JSON.parse(raw);
    const matchesUser =
      identifier === stored.workIdentity.workEmail ||
      identifier === stored.workIdentity.username;

    if (!matchesUser || password !== stored.auth.password) {
      throw new Error("Invalid credentials");
    }

    return { success: true, user: stored };
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    // Replace with actual API call:
    // const token = localStorage.getItem("pm_token");
    // const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // if (!response.ok) throw new Error("Failed to fetch profile");
    // return await response.json();

    // Local storage fallback
    const raw = localStorage.getItem("pm_user");
    if (!raw) throw new Error("No user found");
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(error.message || "Failed to fetch profile");
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    // Replace with actual API call:
    // const token = localStorage.getItem("pm_token");
    // const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(profileData),
    // });
    // if (!response.ok) throw new Error("Update failed");
    // return await response.json();

    // Local storage fallback
    const existing = JSON.parse(localStorage.getItem("pm_user") || "{}");
    const updated = { ...existing, ...profileData };
    localStorage.setItem("pm_user", JSON.stringify(updated));
    return updated;
  } catch (error) {
    throw new Error(error.message || "Update failed");
  }
};

// Get risk data (monthly incidents)
export const getRiskData = async () => {
  try {
    // Replace with actual API call:
    // const token = localStorage.getItem("pm_token");
    // const response = await fetch(`${API_BASE_URL}/risks/monthly`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // if (!response.ok) throw new Error("Failed to fetch risk data");
    // return await response.json();

    // Local storage fallback - return empty data structure
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return MONTHS.map((month) => ({
      month,
      email: 0,
      phone: 0,
      address: 0,
    }));
  } catch (error) {
    throw new Error(error.message || "Failed to fetch risk data");
  }
};

// Logout
export const logoutUser = () => {
  // Clear local storage
  localStorage.removeItem("pm_user");
  localStorage.removeItem("pm_token");
  // In real app, you might also call: await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" });
};

