const adminMiddleware = async (req, res, next) => {
  if (req.user && req.user.type === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access Denied" });
  }
};

module.exports = adminMiddleware;
