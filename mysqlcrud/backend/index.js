const express = require("express")
//to use import models add  "type":"module", in package.json
const mysql = require("mysql")
const cors = require("cors")


const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"test"
})
const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) =>{
    res.json("Hello and welcome to the Backend!")
})
//APIs
app.get("/books", (req,res) =>{
    const query = "SELECT * FROM books"
    db.query(query, (error, data) => {
        if(error) return res.json(error)
        return res.json(data)
    })
})

//post book details(API)
app.post("/books", (req,res) =>{
    const query = "INSERT INTO books (`title`, `description`, `cover`, `price`) VALUES (?)";
    const values =[
        req.body.title,
        req.body.description,
        req.body.cover,
        req.body.price,
    ]
    db.query(query,[values], (error, data) => {
        if(error) return res.json(error)
        return res.json("Book details have been created successfully!")
    })
})

//update Book API
app.put("/books/:id", (req,res) => {
    const bookId = req.params.id;
    const query = "UPDATE books SET `title`=?, `description`=?,`price`=?, `cover`=? WHERE id=?"

    const values =[
        req.body.title,
        req.body.description,
        req.body.price,
        req.body.cover,
    ]

    db.query(query, [...values, bookId], (err, data) => {
        if(err) return res.json(err);
        return res.json("Book has been updated successfully!")
    })
})


//Delete  Book API
app.delete("/books/:id", (req,res) => {
    const bookId = req.params.id;
    const query = "DELETE FROM books WHERE id=?"

    db.query(query, [bookId], (err, data) => {
        if(err) return res.json(err);
        return res.json("Book has been deleted successfully!")
    })
})


app.listen(8800, () => {
    console.log("Backend server is running, Connected!")
})