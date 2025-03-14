const Book = require("../models/bookModel");
const { sendEvent } = require("../eventClient/wsClient")

//Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to show all books", error });
  }
};

//Search for books by title, author or genre
const searchForBooks = async (req, res) => {
  try {
    const { title, author, genre } = req.query;
    const searchCriteria = {};

    if (title) searchCriteria.title = { $regex: title.trim(), $options: "i" };
    if (author)
      searchCriteria.author = { $regex: author.trim(), $options: "i" };
    if (genre) searchCriteria.genre = { $regex: genre.trim(), $options: "i" };

    console.log("Search criteria:", searchCriteria);

    const books = await Book.find(searchCriteria);
    console.log("Books found:", books);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to find books", error });
  }
};

//Borrow a book 
const borrowBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = req.user;

    if (!user) {
      return res
        .status(400)
        .json({ message: "User is required to borrow a book" });
    }

   
    const book = await Book.findOneAndUpdate(
      { bookId: bookId, availability: true },  //Ensure book is available before borrowing
      { $set: { availability: false, borrower: user.username } },
      { new: true } 
    );

    if (!book) {
      return res.status(400).json({ message: "Book already borrowed by another user" });
    }

    //Send WebSocket event to userService
    sendEvent("BookBorrowedEvent", { userId: user.id, bookId: bookId });

    res.status(200).json({ message: `Book borrowed by ${user.username}`, book });
  } catch (error) {
    console.error("Error while borrowing book:", error);
    res
      .status(500)
      .json({ message: "Failed to borrow book", error: error.message });
  }
};


// Return a book
const returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(400).json({ message: "User is required to return a book" });
    }

    const book = await Book.findOneAndUpdate(
      { bookId: bookId, borrower: user.username },
      { $set: { availability: true, borrower: null } },
      { new: true }
    );

    if (!book) {
      return res.status(400).json({ message: "You cannot return a book you didn't borrow" });
    }

    //Send WebSocket event to userService
    sendEvent("BookReturnedEvent", { userId: user.id, bookId: bookId });

    res.status(200).json({ message: `Book ${bookId} returned successfully`, book });
  } catch (error) {
    console.error("Error returning book:", error);
    res.status(500).json({ message: "Failed to return book", error: error.message });
  }
};

//Add a new comment
const addComment = async (req, res) => {
  try {
      const { bookId } = req.params;
      const { userId, text } = req.body;

      if (!text.trim()) {
          return res.status(400).json({ message: "Comment cannot be empty" });
      }

      //Fetch user info from authService - sync
      const userResponse = await fetch(`http://auth-service:5003/api/auth/users/${userId}`);
      if (!userResponse.ok) {
          return res.status(404).json({ message: "User not found in authService" });
      }

      const user = await userResponse.json();

      const book = await Book.findOne({ bookId });
      if (!book) {
          return res.status(404).json({ message: "Book not found" });
      }

      const newComment = {
          userId: user._id,
          username: user.username,
          text,
          date: new Date(),
      };

      book.comments.push(newComment);
      await book.save();

      res.status(201).json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
      res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

//Get comments for a book
const getComments = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findOne({ bookId });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ comments: book.comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};

//Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;

    const book = await Book.findOne({ bookId });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updatedComments = book.comments.filter(comment => comment._id?.toString() !== commentId);

    if (updatedComments.length === book.comments.length) {
      return res.status(404).json({ message: "Comment not found" });
    }

    book.comments = updatedComments;
    await book.save();

    res.status(200).json({ message: "Comment deleted successfully", comments: updatedComments });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};

module.exports = { getAllBooks, borrowBook, returnBook, searchForBooks, addComment, getComments, deleteComment };