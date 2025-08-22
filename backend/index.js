require("dotenv").config();

const mongoose = require("mongoose");
const config = require("./config.json");

mongoose.connect(config.connectionString);

const User = require("./models/user");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

app.post("/api/create-account", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ error: true, message: "Full name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User alredy exists",
    });
  }

  const user = new User({
    name,
    email,
    password,
  });

  try {
    await user.save();

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "24h", // 24 hours is more reasonable
      }
    );

    return res.json({
      error: false,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdOn: user.createdOn,
      },
      accessToken,
      message: "Registration Successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      error: true,
      message: "Failed to create account. Please try again.",
    });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "login Sucessful",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

app.listen(8000);

module.exports = app;
