const express = require("express");
const DBconnection = require("./config/database");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const cors = require("cors");
const healthRoutes = require('./routes/healthRoutes');


const app = express();
app.use(express.json());
app.use(cors());
//Database connection
DBconnection();
//Root route
app.use("/api/auth", authRoutes);
app.use('/health', healthRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Authentication service running on port ${PORT}`);
});
