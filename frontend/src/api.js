const API_URL = import.meta.env.VITE_API_BASE_URL;

export const login = async (username, password) => {
  try {
    const isAdmin = username.toLowerCase().includes("admin");
    const apiEndpoint = isAdmin
      ? `${API_URL}/auth/admin/login`
      : `${API_URL}/auth/login`;

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Login failed");

    const data = await response.json();

    if (!data.userId) {
      throw new Error("User ID is missing from login response");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("role", isAdmin ? "admin" : "user");

    return { ...data, role: isAdmin ? "admin" : "user" };
  } catch (error) {
    console.error("Login error:", error);
    alert("Invalid credentials");
    throw error;
  }
};

const getToken = () => localStorage.getItem("token");

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  window.location.href = "/";
};

export const fetchBooks = async () => {
  try {
    const response = await fetch(`${API_URL}/books`);
    if (!response.ok) throw new Error("Failed to fetch books");
    const books = await response.json();

    return books.map((book) => ({
      ...book,
      bookId: book.bookId,
    }));
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export const borrowBook = async (bookId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/books/borrow/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Borrow failed");
  } catch (error) {
    console.error("Borrow error:", error);
  }
};

export const returnBook = async (bookId) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/books/return/${bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Return failed");
  } catch (error) {
    console.error("Return error:", error);
  }
};

export const fetchBorrowingHistory = async () => {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      throw new Error("User ID not found in localStorage");
    }

    const response = await fetch(`${API_URL}/users/history/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch borrowing history");

    return await response.json();
  } catch (error) {
    console.error("History fetch error:", error);
    return [];
  }
};

export const addBook = async (bookData) => {
  const token = localStorage.getItem("token");
  await fetch(`${API_URL}/admin/books/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });
};

export const updateBook = async (bookId, bookData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/admin/books/update/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });

  if (!response.ok) {
    throw new Error("Failed to update book");
  }

  return await response.json();
};

export const deleteBook = async (bookId) => {
  const token = localStorage.getItem("token");

  console.log("Sending DELETE request for book:", bookId);
  await fetch(`${API_URL}/admin/books/delete/${bookId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchComments = async (bookId) => {
  try {
    const response = await fetch(`${API_URL}/books/books/${bookId}/comments`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch comments: ${errorData.message || "Unknown error"}`,
      );
    }

    const data = await response.json();
    return data.comments || [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

export const addComment = async (bookId, text) => {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token) throw new Error("No token found");
    if (!userId) throw new Error("User ID missing from localStorage");

    const response = await fetch(`${API_URL}/books/books/${bookId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, text }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        `Failed to add comment: ${errorResponse.message || "Unknown error"}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding comment:", error);
    return null;
  }
};

export const deleteComment = async (bookId, commentId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token missing");
    }

    const response = await fetch(
      `${API_URL}/books/books/${bookId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting comment:", error);
    return null;
  }
};
