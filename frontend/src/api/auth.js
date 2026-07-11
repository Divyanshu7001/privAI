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

// Change user password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const raw = localStorage.getItem("pm_user");
    if (!raw) throw new Error("No user found");
    const user = JSON.parse(raw);
    if (user.auth.password !== currentPassword) {
      throw new Error("Current password is incorrect");
    }
    user.auth.password = newPassword;
    localStorage.setItem("pm_user", JSON.stringify(user));
    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    throw new Error(error.message || "Failed to update password");
  }
};

// Delete user account
export const deleteAccount = async () => {
  try {
    localStorage.removeItem("pm_user");
    localStorage.removeItem("pm_token");
    localStorage.removeItem("privai-theme");
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete account");
  }
};

// Get Exceptions list
export const getExceptions = async () => {
  try {
    const raw = localStorage.getItem("pm_user");
    if (!raw) throw new Error("No user found");
    const user = JSON.parse(raw);
    if (!user.exceptions) {
      // Seed default exceptions
      user.exceptions = {
        name: true,
        personalEmail: true,
        workEmail: false,
        phone: false,
        workAddress: false,
        custom: ["Dr. Alexander", "johndoe@company.com"]
      };
      localStorage.setItem("pm_user", JSON.stringify(user));
    }
    return user.exceptions;
  } catch (error) {
    throw new Error("Failed to get exceptions");
  }
};

// Update Exceptions list
export const updateExceptions = async (exceptions) => {
  try {
    const raw = localStorage.getItem("pm_user");
    if (!raw) throw new Error("No user found");
    const user = JSON.parse(raw);
    user.exceptions = exceptions;
    localStorage.setItem("pm_user", JSON.stringify(user));
    return exceptions;
  } catch (error) {
    throw new Error("Failed to update exceptions");
  }
};

// Seed mock incidents list
export const getIncidents = async () => {
  try {
    const rawIncidents = localStorage.getItem("pm_incidents");
    if (!rawIncidents) {
      const seed = [
        {
          id: "1",
          type: "Posting",
          platform: "linkedin",
          title: "Work email (johndoe@company.com) detected in composer",
          action: "acknowledged", // ignored, acknowledged
          date: "2026-07-10T14:32:00Z"
        },
        {
          id: "2",
          type: "Feed",
          platform: "facebook",
          title: "Personal phone number found in comment input",
          action: "ignored",
          date: "2026-07-09T09:15:00Z"
        },
        {
          id: "3",
          type: "Posting",
          platform: "twitter",
          title: "Home address coordinates leaked in tweet draft",
          action: "acknowledged",
          date: "2026-07-08T18:44:00Z"
        },
        {
          id: "4",
          type: "Posting",
          platform: "instagram",
          title: "Unencrypted passcode in text file video frame",
          action: "acknowledged",
          date: "2026-07-06T11:20:00Z"
        },
        {
          id: "5",
          type: "Feed",
          platform: "linkedin",
          title: "Confidential project name in post comment",
          action: "ignored",
          date: "2026-07-05T15:02:00Z"
        }
      ];
      localStorage.setItem("pm_incidents", JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(rawIncidents);
  } catch (error) {
    throw new Error("Failed to get incidents");
  }
};

// Update action for a specific incident
export const updateIncidentAction = async (id, action) => {
  try {
    const incidents = await getIncidents();
    const updated = incidents.map((inc) =>
      inc.id === id ? { ...inc, action } : inc
    );
    localStorage.setItem("pm_incidents", JSON.stringify(updated));
    return updated;
  } catch (error) {
    throw new Error("Failed to update incident action");
  }
};


