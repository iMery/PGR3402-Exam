const express = require("express");
const bodyParser = require("body-parser");
const DBconnection = require("./config/database");
const bookRoutes = require("./routes/bookRoutes");
require("dotenv").config();
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Database connection
DBconnection();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/books", bookRoutes);
app.use('/health', healthRoutes);

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`BookService running on port ${PORT}`);
});
