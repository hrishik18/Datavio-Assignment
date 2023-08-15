const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const authJwt = (req, res, next) => {
    //let token = req.headers["x-access-token"];
    // req.cookies.jwt
    let token = req.headers["x-access-token"] || req.headers.authorization.split(" ")[1];
    console.log("token: ", token);
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token,
        config.secret,
        (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized!",
                });
            }
            req.userId = decoded.id;
            next();
        });
};



module.exports = authJwt;