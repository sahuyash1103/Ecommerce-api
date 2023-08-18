const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../utils/get-env");

function authenticate(req, res, next) {
    let token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. No token provided.");
    try {
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(401).json({ message: "Invalid token.", error: ex });
    }
}

module.exports = authenticate;