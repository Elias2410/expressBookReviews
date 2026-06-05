const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let filteredUsers = users.filter(
    (user) => user.username === username
  )
  return !filteredUsers.length > 0;
}

const authenticatedUser = (username,password)=>{
  let filteredUser = users.filter(
    (user) => user.username === username
  )

  if (filteredUser.length > 0){
    if (filteredUser[0].password === password){
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let {username, password} = req.body

  if (authenticatedUser(username,password)){
    const payload = {user: username};
    const secretKey = "fingerprint_customer";
    const options = {expiresIn: "1h"}

    let accessToken = jwt.sign(payload, secretKey, options);

    res.setHeader('Authorization', `Bearer ${accessToken}`);

    res.status(200).json({message:"user logged in successfully"});

  } else {
    res.status(401).json({message:"Invalid email or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review;
  const isbn = req.params.isbn;
  const user = req.user.user;

  let filteredBooks = Object.entries(books).filter((book)=>{
    return book[0] === isbn;
  })

  if (filteredBooks.length > 0){
    if (filteredBooks[0][1].reviews[user]){
      filteredBooks[0][1].reviews[user] = review;
      return res.status(200).send("Review modified successfully")
    } else {
      filteredBooks[0][1].reviews[user] = review;
      return res.status(200).send("Review added successfully")
    }
  } else {
    return res.status(404).send("Invalid ISBN value")
  }
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
  const isbn = req.params.isbn;
  const user = req.user.user;

  let filteredBooks = Object.entries(books).filter((book)=>{
    return book[0] === isbn;
  })

  if (filteredBooks.length > 0){
    if (filteredBooks[0][1].reviews[user]){
      delete filteredBooks[0][1].reviews[user];
      return res.status(200).send(`Comments asocciated with ${user} has been deleted`)
    } else{
      return res.status(404).send(`There is no comments associated with the user: ${user}`)
    }
  } else{
    return res.status(404).send("Invalid ISBN value");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;