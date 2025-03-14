const express = require("express");
const DBconnection = require("./config/database");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();
const cors = require("cors");
const healthRoutes = require('./routes/healthRoutes');

const app = express();
DBconnection();
app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use('/health', healthRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Admin service running on ${PORT}`);
});
