const Book = require("../models/bookModel");

//Get all books
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error });
  }
};

//Add a new book
const addNewBook = async (req, res) => {
  try {
    const { title, author, publishedYear, genre, bookId } = req.body;

    const newBook = new Book({
      bookId,
      title,
      author,
      publishedYear,
      genre,
    });

    await newBook.save();
    res.status(201).json({ message: "Book added successfully", newBook });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Delete a book
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBook = await Book.findOneAndDelete({ bookId: id });

    if (!deletedBook) {
      console.log("Book not found");
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: error.message });
  }
};

///Updaate a book
const updateBook = async (req, res) => {
  try {
    console.log("Update request received:", req.params, req.body);

    const { id } = req.params;
    const updatedData = req.body;

    console.log("Updating book with ID:", id);
    console.log("Updated data:", updatedData);

    const updatedBook = await Book.findOneAndUpdate(
      { bookId: id.trim() },
      updatedData,
      { new: true, runValidators: true },
    );

    if (!updatedBook) {
      console.log("Book not found");
      return res.status(404).json({ message: "Book not found" });
    }

    console.log("Book updated successfully:", updatedBook);
    res.status(200).json({ message: "Book updated successfully", updatedBook });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addNewBook, deleteBook, updateBook, getAllBooks };
