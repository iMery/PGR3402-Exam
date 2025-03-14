const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");

//User registration
const userRegistration = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists)
      return res
        .status(400)
        .json({ message: "User with that username already exists" });

    const user = await User.create({ username, password, role: "user" });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

//User login
const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Credentials not valid" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    ); //token expires after 2h
    res.status(200).json({ message: "Succsessfully logged in", token, userId: user._id.toString()});
  } catch (error) {
    res.status(500).json({ message: "Failed to login", error });
  }
};

//Admin login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credentials not valid" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ 
      message: "Successfully logged in", 
      token, 
      userId: admin._id.toString()
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to login", error });
  }
};

//Get user info - this will be used so bookService can fetch user info and add comment (sync)
const getUserInfo = async (req, res) => {
  try {
      const user = await User.findById(req.params.userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};


module.exports = { userRegistration, userLogin, adminLogin, getUserInfo };
