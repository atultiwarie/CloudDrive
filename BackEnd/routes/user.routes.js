const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const authMiddleware = require("../middlewares/auth");


router.get("/", (req, res) => {
  res.render("index");
});
router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  body("email").trim().isEmail(),
  body("password").trim().isLength({ min: 5 }),
  body("username").trim().isLength({ min: 3 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Invalid data",
        });
      }

      const { email, username, password } = req.body;

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await userModel.create({
        email,
        username,
        password: hashPassword,
      });
      res.json(newUser);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

router.post(
  "/login",
  body("username").trim().isLength({ min: 3 }),
  body("password").trim().isLength({ min: 5 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Wrong Combination of username and password",
        });
      }

      const { username, password } = req.body;
      const user = await userModel.findOne({ username: username });

      if (!user) {
        return res.status(400).json({
          message: "Username or password is incorrect",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Username or password is incorrect",
        });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          username: user.username,
        },
        process.env.JWT_SECRET
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ message: "Logged In", username: user.username });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});




module.exports = router;

