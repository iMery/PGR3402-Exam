const mongoose = require("mongoose");

const borrowingHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bookId: { type: String, required: true },
  borrowedAt: { type: Date, default: Date.now },
  returnedAt: { type: Date, default: null },
});

module.exports = mongoose.model("BorrowingHistory", borrowingHistorySchema);
