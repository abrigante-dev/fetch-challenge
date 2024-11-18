const express = require("express");
const router = express.Router();

const receipts = {}; // In-memory storage for receipts

// GET /receipts/:id/points
router.get("/:id/points", (req, res) => {
  const { id } = req.params;
  const receipt = receipts[id];

  if (!receipt) {
    return res.status(404).json({ error: "Receipt not found" });
  }

  res.status(200).json({ points: receipt.points });
});

module.exports = router;
