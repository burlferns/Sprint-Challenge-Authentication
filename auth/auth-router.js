const router = require('express').Router();
const bcrypt = require("bcryptjs");


const Users = require("../database/helper/usersModel.js");

const {hashRounds} = require('../consts');
const {signToken,validateAuthBody} = require('../middleware/custom');



// ******************************************************
// POST /register    
// path prefix: /api/auth
// ******************************************************
router.post('/register', validateAuthBody, (req, res) => {
  // implement registration
  
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, hashRounds); 
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json({id:saved.id,username:saved.username});
    })
    .catch(error => {
      res.status(500).json(error);
    });

});



// ******************************************************
// POST /login    
// path prefix: /api/auth
// ******************************************************
router.post('/login', validateAuthBody, (req, res) => {
  // implement login

  let { username, password } = req.body;

  Users.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {

        //Create JWT token
        const jwtToken = signToken(user); 

        //Send the token
        res.status(200).json({
          jwtToken, 
          message: `Welcome ${user.username}!`,
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });

});


// ******************************************************
// ******************************************************
module.exports = router;
