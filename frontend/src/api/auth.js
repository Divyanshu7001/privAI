import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send and receive cookies
});

// Register new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Registration failed");
  }
};

// Login user
export const loginUser = async (identifier, password) => {
  try {
    const response = await api.post("/auth/login", { identifier, password });
    localStorage.setItem("isAuthenticated", "true");
    if (response.data.user) {
      localStorage.setItem("pm_user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch profile");
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put("/auth/profile", profileData);
    if (response.data) {
      localStorage.setItem("pm_user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Update failed");
  }
};

// Get risk data (monthly incidents) computed from backend flagged posts
export const getRiskData = async () => {
  try {
    const response = await api.get("/risks");
    const incidents = response.data;
    
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = MONTHS.map((month) => ({
      month,
      email: 0,
      phone: 0,
      address: 0,
    }));
    
    incidents.forEach((inc) => {
      const date = new Date(inc.date);
      const mIdx = date.getMonth();
      const remarks = (inc.title || "").toLowerCase();
      const type = (inc.type || "").toLowerCase();
      
      if (remarks.includes("email") || type.includes("email")) {
        counts[mIdx].email += 1;
      } else if (remarks.includes("phone") || type.includes("phone") || remarks.includes("number")) {
        counts[mIdx].phone += 1;
      } else {
        counts[mIdx].address += 1;
      }
    });
    
    return counts;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch risk data");
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.warn("[api] Logout api call failed:", err);
  }
  localStorage.removeItem("pm_user");
  localStorage.removeItem("pm_token");
  localStorage.removeItem("isAuthenticated");
  document.cookie = "pm_cookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
};

// Change user password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put("/auth/profile", {
      password: true,
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update password");
  }
};

// Delete user account
export const deleteAccount = async () => {
  try {
    const response = await api.delete("/auth/profile");
    localStorage.removeItem("pm_user");
    localStorage.removeItem("pm_token");
    localStorage.removeItem("privai-theme");
    localStorage.removeItem("isAuthenticated");
    document.cookie = "pm_cookie=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete account");
  }
};

// Get Exceptions list
export const getExceptions = async () => {
  try {
    const response = await api.get("/exceptions");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to get exceptions");
  }
};

// Update Exceptions list
export const updateExceptions = async (exceptions) => {
  try {
    const response = await api.put("/exceptions", exceptions);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update exceptions");
  }
};

// Get incidents list
export const getIncidents = async () => {
  try {
    const response = await api.get("/risks");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to get incidents");
  }
};

// Update action for a specific incident
export const updateIncidentAction = async (id, action) => {
  try {
    const response = await api.put(`/risks/${id}/action`, { action });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update incident action");
  }
};
