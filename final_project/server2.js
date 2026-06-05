const express = require("express");
const books = require("./router/booksdb.js");

const app = express();

app.use(express.json());

app.get('/', (req,res)=>{
    return res.status(200).send(books)
})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log("Server running on: http://localhost:",PORT);
})