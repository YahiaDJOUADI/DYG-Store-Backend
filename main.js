const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Import Routes
const usersRoute = require("./routes/usersRoute");
const productsRoute = require("./routes/productsRoute");
const messageRoutes = require("./routes/messageRoutes");
const orderRoute = require("./routes/orderRoute");
const wishlistRoutes = require("./routes/wishlistRoutes");
const dashboardRoute = require("./routes/dashboardRoute");

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Files
app.use("/public", express.static("public"));

// Routes
app.use(usersRoute);
app.use(productsRoute);
app.use(messageRoutes);
app.use(orderRoute);
app.use(wishlistRoutes);
app.use(dashboardRoute);

// Errors middlewares
app.use(require('./middlewares/notFoundMiddleware'));
app.use(require('./middlewares/errorMiddleware'));

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI)
  .then(async () => {
    // Import and call the createAdmin function
    const createAdmin = require('./createAdmin');
    await createAdmin();

    app.listen(process.env.PORT, () => 
      console.log(`Server started on ${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("Failed to connect to MongoDB:", err));