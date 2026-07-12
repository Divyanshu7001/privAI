const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/auth");

// GET /api/risks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id::text, type, platform, pii_remarks AS title, user_action AS action, created_at AS date
       FROM flagged_posts 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("[risks] Get risks error:", err);
    return res.status(500).json({ error: "Failed to fetch incidents list" });
  }
});

// POST /api/risks
router.post("/", authMiddleware, async (req, res) => {
  const { platform, type, title, remarks, action } = req.body;

  if (!platform || !type || !title || !remarks || !action) {
    return res.status(400).json({ error: "Missing required flagged post parameters" });
  }

  try {
    const result = await db.query(
      `INSERT INTO flagged_posts (user_id, type, platform, pii_remarks, post_title, user_action)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id::text, type, platform, pii_remarks AS title, user_action AS action, created_at AS date`,
      [
        req.user.id,
        type,
        platform.toLowerCase(),
        remarks,
        title,
        action,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("[risks] Log risk error:", err);
    return res.status(500).json({ error: "Failed to log flagged post" });
  }
});

// PUT /api/risks/:id/action
router.put("/:id/action", authMiddleware, async (req, res) => {
  const { action } = req.body;
  const { id } = req.params;

  if (!action) {
    return res.status(400).json({ error: "Action is required" });
  }

  try {
    const checkUser = await db.query(
      "SELECT user_id FROM flagged_posts WHERE id = $1",
      [id]
    );

    if (checkUser.rows.length === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }

    if (checkUser.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access to incident" });
    }

    await db.query(
      "UPDATE flagged_posts SET user_action = $1 WHERE id = $2",
      [action, id]
    );

    // Fetch and return the entire updated list to sync with frontend state
    const result = await db.query(
      `SELECT id::text, type, platform, pii_remarks AS title, user_action AS action, created_at AS date
       FROM flagged_posts 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error("[risks] Update risk action error:", err);
    return res.status(500).json({ error: "Failed to update incident action" });
  }
});

// DELETE /api/risks/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const checkUser = await db.query(
      "SELECT user_id FROM flagged_posts WHERE id = $1",
      [id]
    );

    if (checkUser.rows.length === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }

    if (checkUser.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access to incident" });
    }

    await db.query("DELETE FROM flagged_posts WHERE id = $1", [id]);

    return res.json({ success: true, message: "Incident deleted successfully" });
  } catch (err) {
    console.error("[risks] Delete risk error:", err);
    return res.status(500).json({ error: "Failed to delete incident log" });
  }
});

module.exports = router;
