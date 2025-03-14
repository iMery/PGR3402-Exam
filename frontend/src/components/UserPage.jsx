import React, { useState, useEffect } from "react";
import {
  fetchBooks,
  borrowBook,
  returnBook,
  logout,
  fetchBorrowingHistory,
  fetchComments,
  addComment,
  deleteComment,
} from "../api";
import { jwtDecode } from "jwt-decode";
import "../styling/UserPage.css";

const UserPage = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [bookMap, setBookMap] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        console.log("2 hours passed. Logging out...");
        logout();
      },
      2 * 60 * 60 * 1000,
    );

    return () => clearTimeout(timeout);
  }, []);

  //Fetch logged in user details
  useEffect(() => {
    const fetchUser = () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const decoded = jwtDecode(token);
        setLoggedInUser(decoded.username);

        //fetch userId from localStorage
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          console.error("User ID not found in localStorage");
        }
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };

    fetchUser();
    loadBooks();
    loadHistory();
  }, []);

  //Fetch books
  const loadBooks = async () => {
    try {
      const booksData = await fetchBooks();
      setBooks(booksData);

      const bookMapping = {};
      booksData.forEach((book) => {
        bookMapping[book.bookId] = book;
      });

      setBookMap(bookMapping);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  //Fetch borrow history
  const loadHistory = async () => {
    try {
      const historyData = await fetchBorrowingHistory();
      historyData.sort(
        (a, b) => new Date(b.borrowedAt) - new Date(a.borrowedAt),
      );
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching borrowing history:", error);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await borrowBook(bookId);
      loadBooks();
      loadHistory();
    } catch (error) {
      console.error("Error borrowing book:", error);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      await returnBook(bookId);
      loadBooks();
      loadHistory();
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  const handleViewComments = async (book) => {
    setSelectedBook(book);
    setCommentModalOpen(true);

    try {
      const bookComments = await fetchComments(book.bookId);
      setComments(Array.isArray(bookComments) ? bookComments : []);
    } catch (error) {
      console.error("Error loading comments:", error);
      setComments([]);
    }
  };

  //Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID (_id) is missing!");
      return;
    }

    try {
      await addComment(selectedBook.bookId, newComment);
      setNewComment("");
      handleViewComments(selectedBook);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  //Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(selectedBook.bookId, commentId);
      handleViewComments(selectedBook);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.publishedYear.toString().includes(searchQuery),
  );

  return (
    <div className="user-page">
      <div className="top-bar">
        <span className="logged-in-user">
          Logged in as: <strong>{loggedInUser}</strong>
        </span>
        <div className="button-container">
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
          <button
            className="history-button"
            onClick={() => setShowHistory(true)}
          >
            View Borrowing History
          </button>
        </div>
      </div>
      <h1 className="title">The Book Bar</h1>

      <input
        type="text"
        className="search-bar"
        placeholder="Search for books..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="book-container">
        {filteredBooks.map((book) => (
          <div key={book.bookId} className="book-card">
            <div className="book-content">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>
                {book.genre} - {book.publishedYear}
              </p>

              {book.availability ? (
                <button
                  className="borrow-button"
                  onClick={() => handleBorrow(book.bookId)}
                >
                  Borrow
                </button>
              ) : book.borrower === loggedInUser ? (
                <button
                  className="return-button"
                  onClick={() => handleReturn(book.bookId)}
                >
                  Return
                </button>
              ) : (
                <button className="unavailable-button" disabled>
                  Unavailable
                </button>
              )}

              <button
                className="comment-button"
                onClick={() => handleViewComments(book)}
              >
                View Comments
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Borrowing History Modal */}
      {showHistory && (
        <div className="borrow-history-overlay">
          <div className="borrow-history-box">
            <h2>Borrowing History</h2>
            <div className="borrow-history-content">
              {history.length === 0 ? (
                <p>No borrowing history found.</p>
              ) : (
                history.map((entry) => (
                  <div key={entry._id} className="borrow-history-entry">
                    <strong>
                      {bookMap[entry.bookId]?.title || "Unknown Book"}
                    </strong>
                    <p>{bookMap[entry.bookId]?.author || "Unknown Author"}</p>
                    <p>
                      Borrowed:{" "}
                      {new Date(entry.borrowedAt).toLocaleDateString()}
                    </p>
                    {entry.returnedAt && (
                      <p>
                        Returned:{" "}
                        {new Date(entry.returnedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
            <button
              className="history-close-button"
              onClick={() => setShowHistory(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/*Comment Modal */}
      {commentModalOpen && selectedBook && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Comments for {selectedBook.title}</h2>

            <div className="comment-list">
              {comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="comment-item">
                    <strong>{comment.username || "Anonymous"}</strong>:{" "}
                    {comment.text}
                    {comment.userId === userId && (
                      <button onClick={() => handleDeleteComment(comment._id)}>
                        ❌
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
            <input
              type="text"
              className="comment-input"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment} className="comment-submit">
              Post
            </button>
            <button onClick={() => setCommentModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
