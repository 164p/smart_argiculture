const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// mock data
app.get("/api/sensor/latest", (req, res) => {
  res.json({
    moisture: 43,
    temperature: 29,
    npk: { n: 12, p: 5, k: 8 },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
