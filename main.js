const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
require("dotenv").config();

// Import Routes
const usersRoute = require("./routes/usersRoute");
const productsRoute = require("./routes/productsRoute");
const messageRoutes = require("./routes/messageRoutes");
const orderRoute = require("./routes/orderRoute");

// Middleware
app.use(cors())
app.use(express.json())


// Serve Static Files
app.use("/public", express.static("public"));

// Routes
app.use(usersRoute);
app.use(productsRoute);
app.use(messageRoutes);
app.use(orderRoute);
// erors middlewares
app.use(require('./middlewares/notFoundMiddleware'))
app.use(require('./middlewares/errorMiddleware'))

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/E-commerce")
  .then(() => {
    app.listen(3001, () =>
      console.log("Server started on http://localhost:3001")
    );
  })
  .catch((err) => console.error("Failed to connect to MongoDB:", err));
