const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/auth");

// GET /api/exceptions
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT name, personal_email AS \"personalEmail\", work_email AS \"workEmail\", phone, work_address AS \"workAddress\", custom FROM exceptions WHERE user_id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Exceptions not found for user" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("[exceptions] Get exceptions error:", err);
    return res.status(500).json({ error: "Failed to fetch exceptions" });
  }
});

// PUT /api/exceptions
router.put("/", authMiddleware, async (req, res) => {
  const { name, personalEmail, workEmail, phone, workAddress, custom } = req.body;

  try {
    const result = await db.query(
      `UPDATE exceptions 
       SET name = $1, personal_email = $2, work_email = $3, phone = $4, work_address = $5, custom = $6
       WHERE user_id = $7
       RETURNING name, personal_email AS "personalEmail", work_email AS "workEmail", phone, work_address AS "workAddress", custom`,
      [
        name ?? true,
        personalEmail ?? true,
        workEmail ?? false,
        phone ?? false,
        workAddress ?? false,
        custom ?? [],
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Exceptions not found for user" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error("[exceptions] Update exceptions error:", err);
    return res.status(500).json({ error: "Failed to update exceptions" });
  }
});

module.exports = router;
