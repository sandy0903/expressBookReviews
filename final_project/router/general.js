const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username=req.body.username;
  let password=req.body.password;
  if(username && password){
    let newUser={
      username,
      password
    }
    users.push(newUser)
    return res.send(`Hello ${JSON.stringify(newUser.username)}`)
  }else {
    return res.send("Enter you password and username to register")
  }
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let myPromise1 = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
    },6000)})
    myPromise1.then((books)=> res.send(JSON.stringify(books)))
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  async function getFilteredBook(){
    let isbnBook=await parseInt(req.params.isbn);
    let filteredBook=isbnBook ? books[isbnBook]: 1
    return res.send(filteredBook)
  }
  getFilteredBook()
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  async function getBookAuthor(){
    let authorName=await (req.params.author);
    let filteredAuthors=[]
    for (let book in books){
      if(books[book]["author"]===authorName){
        filteredAuthors.push(books[book])
      }
    }
    return res.send(JSON.stringify(filteredAuthors));
  }
  getBookAuthor()
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  async function getBookTitle(){
    let title= await req.params.title;
  let filteredTitle=[]
  for (let book in books){
    if(books[book]["title"]===title){
      filteredTitle.push(books[book])
    }
  }
  if(filteredTitle.length>0){
    return res.send(JSON.stringify(filteredTitle));
  }else {
    return res.send("Title have not found")
  }
  }
  getBookTitle()
  
  
  
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbnBook=parseInt(req.params.isbn);
  let filteredBook=books[isbnBook]
  if(filteredBook){
    return res.send(JSON.stringify(filteredBook.reviews))
  }else {
    return res.send("book dont have any reviews")
  }
  
  
});

module.exports.general = public_users;
