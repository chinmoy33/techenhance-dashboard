const express = require("express");
const cors = require("cors");
require("dotenv").config();

const recommendationRoutes = require("./routes/recommendationroute");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/api/recommendations", recommendationRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "Recommendation service OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Recommendation service running on port ${PORT}`);
});
