const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  // Write your code here
  // get username and password of current user
  let username = req.body.username;
  let password = req.body.password;
  // check username and password valid or not
  if (username && password) {
    // check if user had registered or not
    let filteredUser = users.filter(user => user.username===username)
    if (filteredUser.length>0) {
      
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
        accessToken, username
      }
      res.send("Youre logged")
    }
  } else {
    res.send("You have not registered yet")
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let username=req.session.authorization.username;
  let userReview=req.body.review;
  let book=req.params.isbn;
  let filteredBook=books[book];
  filteredBook["reviews"].username=username;
  filteredBook["reviews"].review=userReview;
  res.send(JSON.stringify(filteredBook))
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
  let filteredBook=books[req.params.isbn]
  let username=req.session.authorization.username;
  if(filteredBook["reviews"].username===username){
    filteredBook["reviews"]={}
    res.send(filteredBook)
  }else {
    res.send("cannot delete review of others")
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
