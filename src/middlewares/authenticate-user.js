const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../utils/get-env");

function authenticate(req, res, next) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. No token provided.");
    try {
        const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(401).send("Invalid token.");
    }
}

module.exports = authenticate;