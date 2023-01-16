const express = require("express")
//to use import models add  "type":"module", in package.json
const mysql = require("mysql")

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"test"
})
const app = express()
app.use(express.json())

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
    const query = "INSERT INTO books (`title`, `description`, `cover`) VALUES (?)";
    const values =[
        req.body.title,
        req.body.description,
        req.body.cover,
    ]
    db.query(query,[values], (error, data) => {
        if(error) return res.json(error)
        return res.json("Book details have been created successfully!")
    })
})

app.listen(8800, () => {
    console.log("Backend server is running, Connected!")
})