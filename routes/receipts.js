const express = require("express");
const router = express.Router();

const receipts = {}; // In-memory storage for receipts

// POST /receipts/process
router.post("/process", (req, res) => {
  const { retailer, purchaseDate, purchaseTime, items, total } = req.body;

  // Validate receipt structure
  if (!retailer || !purchaseDate || !purchaseTime || !items?.length || !total) {
    return res.status(400).json({ error: "Invalid receipt format" });
  }

  // Generate a unique receipt ID (UUID or custom ID generator)
  const id = Math.random().toString(36).substr(2, 9);
  receipts[id] = {
    retailer,
    purchaseDate,
    purchaseTime,
    items,
    total,
    points: 100,
  }; // Example points logic

  res.status(200).json({ id });
});

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
