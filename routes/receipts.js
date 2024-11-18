const express = require("express");
const router = express.Router();

const receipts = {}; // In-memory storage for receipts

/**
 * Calculate points for a receipt based on the defined rules.
 * @param {object} receipt The receipt object.
 * @returns {number} The total points awarded.
 */
const calculatePoints = (receipt) => {
  let points = 0;

  // Rule 1: One point for every alphanumeric character in the retailer name.
  points += (receipt.retailer.match(/[a-z0-9]/gi) || []).length;

  // Rule 2: 50 points if the total is a round dollar amount with no cents.
  if (/^\d+\.00$/.test(receipt.total)) {
    points += 50;
  }

  // Rule 3: 25 points if the total is a multiple of 0.25.
  if (parseFloat(receipt.total) % 0.25 === 0) {
    points += 25;
  }

  // Rule 4: 5 points for every two items on the receipt.
  points += Math.floor(receipt.items.length / 2) * 5;

  // Rule 5: Points for item descriptions with lengths multiple of 3.
  receipt.items.forEach((item) => {
    const descriptionLength = item.shortDescription.trim().length;
    if (descriptionLength % 3 === 0) {
      points += Math.ceil(parseFloat(item.price) * 0.2);
    }
  });

  // Rule 6: 6 points if the day in the purchase date is odd.
  const day = parseInt(receipt.purchaseDate.split("-")[2], 10);
  if (day % 2 !== 0) {
    points += 6;
  }

  // Rule 7: 10 points if the time of purchase is after 2:00pm and before 4:00pm.
  const [hour, minute] = receipt.purchaseTime.split(":").map(Number);
  if (hour === 14 || (hour === 15 && minute === 0)) {
    points += 10;
  }

  return points;
};

// POST /receipts/process
router.post("/process", (req, res) => {
  const { retailer, purchaseDate, purchaseTime, items, total } = req.body;

  // Validate receipt structure
  if (!retailer || !purchaseDate || !purchaseTime || !items?.length || !total) {
    return res.status(400).json({ error: "Invalid receipt format" });
  }

  // Calculate points and store receipt
  const id = Math.random().toString(36).substr(2, 9);
  const points = calculatePoints(req.body);
  receipts[id] = { retailer, purchaseDate, purchaseTime, items, total, points };

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
