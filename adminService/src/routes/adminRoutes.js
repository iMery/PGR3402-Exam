const express = require("express");
const {
  addNewBook,
  deleteBook,
  updateBook,
  getAllBooks
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllBooks);

//Add a book
router.post("/books/add", authMiddleware, addNewBook);

//Remove a book
router.delete("/books/delete/:id", authMiddleware, deleteBook);

//Update an exisiting book
router.put("/books/update/:id", authMiddleware, updateBook);

module.exports = router;
