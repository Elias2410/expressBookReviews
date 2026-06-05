const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

/**
 * @route   POST /register
 * @desc    Register a new user in the system
 * @access  Public
 */
public_users.post("/register", (req, res) => {
  let { username, password } = req.body;

  // Validate that both username and password are provided
  if (username && password) {
    // Check if the username is valid (i.e., not already taken)
    if (isValid(username)) {
      users.push({
        username: `${username}`,
        password: `${password}`
      });
      return res.status(200).json({ message: "User created successfully and can login!" });
    } else {
      return res.status(409).json({ message: "This username already in use!" });
    }
  } else {
    return res.status(403).json({ message: "username and/or password are not provided in body" });
  }
});

/**
 * @route   GET /
 * @desc    Get the list of all books available in the shop using Async/Await
 * @access  Public
 */
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:3000/");
    return res.status(200).send(response.data);
  } catch (error) {
    console.error("Error fetching data: ", error.message);
    return res.status(500).json({ message: "Error fetching data" });
  }
});

/**
 * @route   GET /isbn/:isbn
 * @desc    Get book details based on ISBN using Async/Await
 * @access  Public
 */
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  try {
    let response = await axios.get("http://localhost:3000/");
    
    // Convert object to key-value pairs, filter by matching ISBN key, and rebuild object
    let filteredBooks = Object.entries(response.data).filter(
      (book) => book[0] === isbn
    );
    
    // If no book matches the provided ISBN, return a 404 error
    if (filteredBooks.length === 0) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }

    filteredBooks = Object.fromEntries(filteredBooks);
    return res.status(200).send(filteredBooks);
  } catch (error) {
    console.error("Error fetching data: ", error.message);
    return res.status(500).json({ message: "error fetching data" });
  }
});

/**
 * @route   GET /author/:author
 * @desc    Get book details based on author using Async/Await
 * @access  Public
 */
public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author;
  try {
    // Fetch the list of all books from the root API
    let response = await axios.get("http://localhost:3000/");
    
    // Filter books matching the requested author by extracting object entries
    let filteredEntries = Object.entries(response.data).filter(
      (book) => book[1].author.toLowerCase() === author.toLowerCase()
    );

    // CRITICAL FIX: Verify if any books were found for the requested author
    if (filteredEntries.length === 0) {
      return res.status(404).json({ message: `No books found for author: '${author}'` });
    }

    // Reconstruct the filtered entries back into a JSON object format
    let filteredBooks = Object.fromEntries(filteredEntries);
    return res.status(200).json(filteredBooks);

  } catch (error) {
    // Log the error natively and respond with a clean error payload
    console.error("Error fetching data for author: ", error.message);
    return res.status(500).json({ message: "Error fetching data" });
  }
});

/**
 * @route   GET /title/:title
 * @desc    Get all books based on title using Async/Await
 * @access  Public
 */
public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title;
  try {
    let response = await axios.get("http://localhost:3000/");
    
    // Filter books matching the requested title
    let filteredBooks = Object.entries(response.data).filter(
      (book) => book[1].title.toLowerCase() === title.toLowerCase()
    );
    
    // If no books match the provided title, return a 404 error
    if (filteredBooks.length === 0) {
      return res.status(404).json({ message: `No books found with the title: '${title}'` });
    }

    filteredBooks = Object.fromEntries(filteredBooks);
    return res.status(200).send(filteredBooks);
  } catch (error) {
    console.error("Error fetching data: ", error.message);
    return res.status(500).json({ message: "error fetching data" });
  }
});

/**
 * @route   GET /review/:isbn
 * @desc    Get book reviews based on ISBN from local database
 * @access  Public
 */
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;

  // Find book by ISBN from the local books module
  let filteredBooks = Object.entries(books).filter(
    (book) => book[0] === isbn
  );

  if (filteredBooks.length === 0) {
    return res.status(404).json({ message: `No reviews found. Book with ISBN ${isbn} does not exist.` });
  }

  filteredBooks = Object.fromEntries(filteredBooks);

  // Return the prettified reviews object
  return res.status(200).send(`reviews:` + JSON.stringify(filteredBooks[isbn]["reviews"], null, 4));
});

module.exports.general = public_users;