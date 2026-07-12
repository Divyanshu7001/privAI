const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const authMiddleware = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret_privai_key_2026";
const COOKIE_EXPIRE_DAYS = 5;

// GET /api/auth (for extension checkAuth)
router.get("/", async (req, res) => {
  let token = req.query.cookie || req.cookies?.pm_cookie || null;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) {
    return res.json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch fresh user info
    const result = await db.query(
      "SELECT id, username, work_email FROM users WHERE id = $1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.json({ isAuthenticated: false });
    }

    const user = result.rows[0];
    return res.json({
      isAuthenticated: true,
      user: {
        name: user.username,
        email: user.work_email,
      },
    });
  } catch (err) {
    return res.json({ isAuthenticated: false });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { workIdentity, auth, monitoringContacts, addresses } = req.body;

  if (!workIdentity?.workEmail || !workIdentity?.username || !auth?.password) {
    return res.status(400).json({ error: "Missing required registration fields" });
  }

  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    // Check if user exists
    const userCheck = await client.query(
      "SELECT 1 FROM users WHERE work_email = $1 OR username = $2",
      [workIdentity.workEmail.toLowerCase(), workIdentity.username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "User with this work email or username already exists" });
    }

    const passwordHash = await bcrypt.hash(auth.password, 10);
    const personalEmails = monitoringContacts?.personalEmails || [];
    const phones = monitoringContacts?.phones || [];
    const personalAddress = addresses?.personal || {};
    const workAddress = addresses?.work || null;

    // Insert user
    const insertUserRes = await client.query(
      `INSERT INTO users (username, work_email, password_hash, personal_emails, phones, personal_address, work_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        workIdentity.username,
        workIdentity.workEmail.toLowerCase(),
        passwordHash,
        personalEmails,
        phones,
        JSON.stringify(personalAddress),
        workAddress ? JSON.stringify(workAddress) : null,
      ]
    );

    const userId = insertUserRes.rows[0].id;

    // Insert default exceptions
    await client.query(
      `INSERT INTO exceptions (user_id, name, personal_email, work_email, phone, work_address, custom)
       VALUES ($1, TRUE, TRUE, FALSE, FALSE, FALSE, $2)`,
      [userId, ["Dr. Alexander", "johndoe@company.com"]]
    );

    await client.query("COMMIT");

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[register] Registration error:", err);
    return res.status(500).json({ error: "Registration failed due to server error" });
  } finally {
    client.release();
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: "Identifier and password are required" });
  }

  try {
    // Find user by work_email or username
    const result = await db.query(
      "SELECT * FROM users WHERE work_email = $1 OR username = $2",
      [identifier.toLowerCase(), identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.work_email },
      JWT_SECRET,
      { expiresIn: `${COOKIE_EXPIRE_DAYS}d` }
    );

    // Set cookie
    res.cookie("pm_cookie", token, {
      httpOnly: false, // Let extension read it
      path: "/",
      maxAge: COOKIE_EXPIRE_DAYS * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    const userProfile = {
      workIdentity: {
        username: user.username,
        workEmail: user.work_email,
      },
      monitoringContacts: {
        personalEmails: user.personal_emails,
        phones: user.phones,
      },
      addresses: {
        personal: user.personal_address || {},
        work: user.work_address || null,
      },
    };

    return res.json({ success: true, token, user: userProfile });
  } catch (err) {
    console.error("[login] Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("pm_cookie", { path: "/" });
  return res.json({ success: true, message: "Logged out successfully" });
});

// GET /api/auth/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const userProfile = {
      workIdentity: {
        username: user.username,
        workEmail: user.work_email,
      },
      monitoringContacts: {
        personalEmails: user.personal_emails,
        phones: user.phones,
      },
      addresses: {
        personal: user.personal_address || {},
        work: user.work_address || null,
      },
    };

    return res.json(userProfile);
  } catch (err) {
    console.error("[profile] Get profile error:", err);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// PUT /api/auth/profile
router.put("/profile", authMiddleware, async (req, res) => {
  const { workIdentity, password } = req.body;

  try {
    // Determine what to update
    if (password) {
      // Update password check
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new passwords are required" });
      }

      const userRes = await db.query("SELECT password_hash FROM users WHERE id = $1", [req.user.id]);
      const user = userRes.rows[0];

      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [newHash, req.user.id]);
      return res.json({ success: true, message: "Password updated successfully" });
    }

    // Else update username/email identity
    if (!workIdentity?.username || !workIdentity?.workEmail) {
      return res.status(400).json({ error: "Username and work email are required" });
    }

    const result = await db.query(
      `UPDATE users 
       SET username = $1, work_email = $2 
       WHERE id = $3 
       RETURNING username, work_email, personal_emails, phones, personal_address, work_address`,
      [workIdentity.username, workIdentity.workEmail.toLowerCase(), req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const userProfile = {
      workIdentity: {
        username: user.username,
        workEmail: user.work_email,
      },
      monitoringContacts: {
        personalEmails: user.personal_emails,
        phones: user.phones,
      },
      addresses: {
        personal: user.personal_address || {},
        work: user.work_address || null,
      },
    };

    return res.json(userProfile);
  } catch (err) {
    console.error("[profile] Update profile error:", err);
    return res.status(500).json({ error: "Failed to update profile settings" });
  }
});

// DELETE /api/auth/profile
router.delete("/profile", authMiddleware, async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = $1", [req.user.id]);
    res.clearCookie("pm_cookie", { path: "/" });
    return res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error("[profile] Delete profile error:", err);
    return res.status(500).json({ error: "Failed to delete account" });
  }
});

module.exports = router;
