const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

// set token secret and expiration date
const secret = "JWT_SECRET";
const expiration = "2h";

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: "You have no token!" });
    }

    // verify token and get user data out of it
    try {
      const data = jwt.verify(token, secret);
      console.log("Signing secret:", secret);
      console.log("Decoded data:", data);
      req.user = data;
    } catch (err) {
      console.log("Invalid token");
      console.log("Error details:", err);
      return res.status(400).json({ message: "invalid token!" });
    }

    // send to next endpoint
    next();
  },
  signToken: function ({ username, email, _id }) {
    console.log("Signing secret:", secret);
    const payload = { username, email, _id };
    const token = jwt.sign(payload, secret, {
      expiresIn: expiration,
    });
    console.log("Signed token:", token);
    return token;
  },
};
