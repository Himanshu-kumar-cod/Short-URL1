const {v4:uuidv4}=require('uuid')
const User = require("../models/user");
const URL = require("../models/url");
const {setUser} = require('../service/auth')

// ----------------- SIGNUP -----------------
async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send("Email already registered. Please login instead.");
    }

    await User.create({ name, email, password });

    const allurls = await URL.find({});
    return res.render("home", {
      id: null,
      urls: allurls,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).send("Internal Server Error");
  }
}

// ----------------- LOGIN -----------------
async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.render("login", {
        error: "Invalid Username or Password",
      });
    }

    const token = setUser(user);
    res.cookie("token",token);
    return res.redirect("/");
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).send("Internal Server Error");
  }
}

// ----------------- EXPORT -----------------
module.exports = { handleUserSignup, handleUserLogin };
