const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


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
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:3000/");
    return res.status(200).send(response.data);
  } catch (error) {
    console.error("Error fetching data: ", error.message);
    return res.status(500).json({ message: "Error fetching data" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  let isbn = req.params.isbn;
  try {
    let response = await axios.get("http://localhost:3000/");
    let filteredBooks = Object.entries(response.data).filter(
      (book) => book[0] === isbn
    )
    filteredBooks = Object.fromEntries(filteredBooks);
    return res.status(200).send(filteredBooks);
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({message:"error fetching data"});
  }
 });

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  let author = req.params.author
  try {
    let response = await axios.get("http://localhost:3000/");
    let filteredBooks = Object.entries(response.data).filter(
      (book) => book[1].author === author
    );
    filteredBooks = Object.fromEntries(filteredBooks);
    return res.status(200).send(filteredBooks);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("error fetching data")
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  let title = req.params.title;
  try {
    let response = await axios.get("http://localhost:3000/");
    let filteredBooks = Object.entries(response.data).filter(
      (book) => book[1].title === title
    );
    filteredBooks = Object.fromEntries(filteredBooks);
    return res.status(200).send(filteredBooks);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("error fetching data")
  }
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
