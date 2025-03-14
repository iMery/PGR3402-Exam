const WebSocket = require("ws");
const {
  recordBorrowedBook,
  recordReturnedBook,
} = require("../controllers/borrowingHistoryController");

const wss = new WebSocket.Server({ port: 8082 });
console.log("WebSocket Server running on ws://localhost:8082");

//Function to notify all connected clients
const notifyClients = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ message }));
    }
  });
};

//Handle new WebSocket connections
wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ message: "Connected to WebSocket Server" }));

  ws.on("message", async (message) => {
    try {
      const event = JSON.parse(message);

      if (event.eventType === "BookBorrowedEvent") {
        await recordBorrowedBook(event.data.userId, event.data.bookId);
        notifyClients(
          `Book ${event.data.bookId} borrowed by user ${event.data.userId}`,
        );
      } else if (event.eventType === "BookReturnedEvent") {
        await recordReturnedBook(event.data.userId, event.data.bookId);
        notifyClients(
          `Book ${event.data.bookId} returned by user ${event.data.userId}`,
        );
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  });

  ws.on("close", () => {});
});

module.exports = { wss, notifyClients };
