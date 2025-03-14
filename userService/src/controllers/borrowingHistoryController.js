const BorrowingHistory = require("../models/borrwingHistoryModel");
const mongoose = require("mongoose");

//Get borrow history for a user
const getUserBorrowingHistory = async (req, res) => {
  try {
    const userId = req.params.userId.trim();
    const history = await BorrowingHistory.find({ userId });

    if (!history.length) {
      return res.status(404).json({ message: "No borrowing history found" });
    }

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//Record a borrowed book
const recordBorrowedBook = async (userId, bookId) => {
  try {
    const newEntry = new BorrowingHistory({ userId, bookId });
    await newEntry.save();
    console.log(`Book ${bookId} borrowed by user ${userId}`);
  } catch (error) {
    console.error("Error saving borrowed book:", error);
  }
};

//Record a returned book
const recordReturnedBook = async (userId, bookId) => {
  try {
    await BorrowingHistory.findOneAndUpdate(
      { userId, bookId, returnedAt: null },
      { returnedAt: new Date() },
    );
    console.log(`Book ${bookId} returned by user ${userId}`);
  } catch (error) {
    console.error("Error updating returned book:", error);
  }
};

module.exports = {
  getUserBorrowingHistory,
  recordBorrowedBook,
  recordReturnedBook,
};
