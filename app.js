const express = require("express");
const app = express();
const receiptsRoutes = require("./routes/receipts");
const PORT = 3000;

app.use(express.json());
app.use("/receipts", receiptsRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = app;
