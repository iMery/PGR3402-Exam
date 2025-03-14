const mongoose = require("mongoose");

//Defining my book model
const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publishedYear: { type: String, required: true },
  availability: { type: Boolean, default: true },
  borrower: { type: String, default: null },
});

module.exports = mongoose.model("Book", bookSchema);
