let db = app.sequelize.models;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  try {
    let { token } = req.headers;

    if (!token) return res.status(400).json({ msg: "No token provided" });

    let user = jwt.verify(token, process.env.token_secret);
    req.decoded = user;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error, msg: error.message });
  }
};

module.exports = {
  authUser,
};
