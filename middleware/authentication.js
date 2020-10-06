const jwt = require('jsonwebtoken');
require('dotenv').config();
const {User} = require("../model/userschema");

module.exports = async (req, res, next) => {
  //check if the req has token
  const token = req.cookies['x-jwt-token'];
  if (token) {
    const {id} = jwt.verify(token, process.env.JWTSECRETKEY);
    const user = await User.findUserById(id);
    res.locals.authenticated = true;
    res.locals.user = user;
  }
  next();
};
