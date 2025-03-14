import React, { useState, useEffect } from "react";
import { fetchBooks, addBook, updateBook, deleteBook, logout } from "../api";
import "../styling/AdminPage.css";

const AdminPage = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    publishedYear: "",
  });
  const [editingBook, setEditingBook] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const adminUsername = localStorage.getItem("username") || "Admin";

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const booksData = await fetchBooks();
      setBooks(booksData);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleAddBook = async () => {
    try {
      const newBookWithId = {
        ...newBook,
        bookId: `BOOK-${Date.now()}`, //Genrate a bookid
      };

      await addBook(newBookWithId);
      setNewBook({ title: "", author: "", genre: "", publishedYear: "" });
      loadBooks();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleUpdateBook = async () => {
    try {
      await updateBook(editingBook.bookId, editingBook);
      setEditingBook(null);
      loadBooks();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook(bookId);
      loadBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="admin-page">
      <h1 className="title">The Book Bar</h1>
      <span>Logged in as: {adminUsername}</span>
      <button className="add-book-btn" onClick={() => setIsAdding(true)}>
        Add Book
      </button>
      <button className="logout-button" onClick={logout}>
        Logout
      </button>

      {/* Book List */}
      <div className="book-container">
        {books.map((book) => (
          <div key={book.bookId} className="book-card">
            <h3>{book.title}</h3>
            <p>
              {book.author} - {book.genre} - {book.publishedYear}
            </p>
            <button
              className="action-btn edit-btn"
              onClick={() => setEditingBook(book)}
            >
              Edit
            </button>
            <button
              className="action-btn delete-btn"
              onClick={() => handleDeleteBook(book.bookId)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add Book Modal */}
      {isAdding && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add a New Book</h2>
            <input
              type="text"
              placeholder="Title"
              value={newBook.title}
              onChange={(e) =>
                setNewBook({ ...newBook, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Author"
              value={newBook.author}
              onChange={(e) =>
                setNewBook({ ...newBook, author: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Genre"
              value={newBook.genre}
              onChange={(e) =>
                setNewBook({ ...newBook, genre: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Published Year"
              value={newBook.publishedYear}
              onChange={(e) =>
                setNewBook({ ...newBook, publishedYear: e.target.value })
              }
            />
            <button className="modal-btn" onClick={handleAddBook}>
              Add Book
            </button>
            <button
              className="modal-btn cancel-btn"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Book</h2>
            <input
              type="text"
              value={editingBook.title}
              onChange={(e) =>
                setEditingBook({ ...editingBook, title: e.target.value })
              }
            />
            <input
              type="text"
              value={editingBook.author}
              onChange={(e) =>
                setEditingBook({ ...editingBook, author: e.target.value })
              }
            />
            <input
              type="text"
              value={editingBook.genre}
              onChange={(e) =>
                setEditingBook({ ...editingBook, genre: e.target.value })
              }
            />
            <input
              type="number"
              value={editingBook.publishedYear}
              onChange={(e) =>
                setEditingBook({
                  ...editingBook,
                  publishedYear: e.target.value,
                })
              }
            />
            <button className="modal-btn" onClick={handleUpdateBook}>
              Update Book
            </button>
            <button
              className="modal-btn cancel-btn"
              onClick={() => setEditingBook(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
