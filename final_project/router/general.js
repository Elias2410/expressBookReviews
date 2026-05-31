const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let {username, password} = req.body
  if (username && password){
    if (isValid(username)) {
      users.push({
        username:`${username}`,
        password: `${password}`
      })
      return res.status(200).json({message:"User created successfully and can login!"})
    } else {
      return res.status(409).json({message:"This username already in use!"})
    }
  } else{
    return res.status(403).json({message:"username and/or password are not provided in body"})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn

  let filteredBooks = Object.entries(books).filter(
    (book) => book[0] === isbn
  )

  filteredBooks = Object.fromEntries(filteredBooks)

  return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  let author = req.params.author

  let filteredBooks = Object.entries(books).filter(
    (book) => book[1].author === author
  )

  filteredBooks = Object.fromEntries(filteredBooks)

  return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;

  let filteredBooks = Object.entries(books).filter(
    (book) => book[1].title === title
  )

  filteredBooks = Object.fromEntries(filteredBooks)  

  return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

  let isbn = req.params.isbn

  let filteredBooks = Object.entries(books).filter(
    (book) => book[0] === isbn
  )

  filteredBooks = Object.fromEntries(filteredBooks)

  return res.status(200).send(`reviews:` + JSON.stringify(filteredBooks[isbn]["reviews"], null, 4));
});

module.exports.general = public_users;
