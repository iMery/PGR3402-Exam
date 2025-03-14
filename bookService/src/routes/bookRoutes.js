const express = require("express");
const {
  getAllBooks,
  borrowBook,
  returnBook,
  searchForBooks,
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
//Get all books
router.get("/", getAllBooks);
//Search for books
router.get("/search", searchForBooks);
//Borrow a book
router.post("/borrow/:bookId", authMiddleware, borrowBook);
//Return a book
router.post("/return/:bookId", authMiddleware, returnBook);


//Add comment 
router.post("/books/:bookId/comments", addComment);
//Get comments for a book
router.get("/books/:bookId/comments", getComments);
//Delete a comment 
router.delete("/books/:bookId/comments/:commentId", deleteComment);

module.exports = router;
