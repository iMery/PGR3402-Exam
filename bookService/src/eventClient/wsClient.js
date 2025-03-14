const WebSocket = require("ws");

const ws = new WebSocket("ws://user-service:8082"); //Connect to the UserService WebSocket

ws.on("open", () => {
  console.log("Connected to UserService WebSocket");
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});

//Function to send events to UserService
const sendEvent = (eventType, data) => {
  if (ws.readyState === WebSocket.OPEN) {
    console.log(`Sending WebSocket Event: ${eventType}`, data);
    ws.send(JSON.stringify({ eventType, data }));
  } else {
    console.error("WebSocket connection is not open");
  }
};

module.exports = { sendEvent };
