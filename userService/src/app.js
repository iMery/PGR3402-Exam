const express = require("express");
const DBconnection = require("./config/database");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
require("./eventDriven/wsService");
const healthRoutes = require('./routes/healthRoutes');

const app = express();
app.use(express.json());
app.use(cors());
//Database connection
DBconnection();
app.use("/api/users", userRoutes);
app.use('/health', healthRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
