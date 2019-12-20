const jwt = require("jsonwebtoken");

const {jwtSecret} = require('../consts');

module.exports = {signToken,validateAuthBody};

// ******************************************************
// signToken    
// This functions creates and signs the JWT token
// ******************************************************
function signToken(user) {
  const payload = {
    id: user.id,
  };

  const options = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, jwtSecret, options); 
}


// ********************************************************
// validateAuthBody
// ********************************************************
function validateAuthBody(req, res, next) {
  const body = req.body;
    // console.log("In validatePrjData",body);
    if(Object.keys(body).length === 0) {
      res.status(400).json({ message: "missing body data" });
    } 
    else if(!body.username) {
      res.status(400).json({ message: "missing required username field in body data" });
    } 
    else if(!body.password) {
      res.status(400).json({ message: "missing required password field in body data" });
    } 
    else {
      next();
    }
}