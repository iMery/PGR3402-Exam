const express = require("express");
const {
  userRegistration,
  userLogin,
  adminLogin,
  getUserInfo,
} = require("../controllers/authController");
const router = express.Router();

//User Routes
router.post("/register", userRegistration);
router.post("/login", userLogin);
//Admin Login
router.post("/admin/login", adminLogin);
//Get user info 
router.get("/users/:userId", getUserInfo) 



module.exports = router;
