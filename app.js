const express = require("express");
const app = express();
const receiptsRoutes = require("./routes/receipts");

app.use(express.json());
app.use("/receipts", receiptsRoutes);

module.exports = app;
