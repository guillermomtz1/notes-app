const express = require("express");
const cors = require("cors");
const app = express();

// Load environment variables
require("dotenv").config();

// Connect to database
const { connectDB } = require("./config/database");
connectDB();

app.use(express.json());

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

require("./startup/routes")(app);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Error handling middleware (must be last)
const { errorHandler, notFound } = require("./middleware/errorHandler");
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
