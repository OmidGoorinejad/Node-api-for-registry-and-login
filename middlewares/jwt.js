const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function token(req, res, next) {
    try {
        const token = req.header("Authentication");
        if (!token) return res.status(400).send("token not found.");
        jwt.verify(token, process.env.SECRET_KEY);
        res.send("ok token");
        next();

    } catch (error) {
        res.send("error")
    }
}