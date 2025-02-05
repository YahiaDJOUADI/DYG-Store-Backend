const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddelware"); 
const dashboardController = require("../controllers/dashboardController");
const router = express.Router();

router.get("/dashboard", authMiddleware, adminMiddleware, dashboardController.getAllDataCounts);

module.exports = router;