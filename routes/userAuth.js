const jwt = require("jsonwebtoken");

const authentucateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];  // Corrected the split

    if (token == null) {
        return res.status(401).json({ message: "Authentication token required" });
    }

    jwt.verify(token, "bookstore123", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token expired, please sign in again" });
        }
        req.user = user;
        next();
    });
};

module.exports = { authentucateToken };   // Corrected the export
