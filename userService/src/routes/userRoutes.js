const express = require("express");
const {
  getUserBorrowingHistory,
} = require("../controllers/borrowingHistoryController");
const router = express.Router();

router.get("/history/:userId", getUserBorrowingHistory);

module.exports = router;
