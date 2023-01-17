import React, { useState, useEffect } from 'react'
import axios from "axios"
import { Link } from 'react-router-dom'

const Books = () => {
  const [books, setBooks] = useState([])

  const fetchBooks = async () => {
    try{
        const response = await axios.get("http://localhost:8800/books")
        //console.log(response.data)
        setBooks(response.data)
    }catch(error){
        console.log("Error!", error)
    }
  }

  const handleDelete = async (id) => {
    try{
        await axios.delete(`http://localhost:8800/books/${id}`)
        //Reload the page
        window.location.reload()

    }catch(error){
        console.log("Error!", error)
    }

  }


  useEffect(() => {
    fetchBooks();
  }, [])
  
  return (
    <div>
        <h1>Buenas Books Shop</h1>
        <div className="books">
            {
                books.map(book=>(
                    <div className="book" key={book.id}>
                        { book.cover && <img src={book.cover} alt={book.title}/> }
                        <h3>{book.title}</h3>
                        <p>{book.description}</p>
                        <span>Price: {book.price}</span>
                        <button className='delete' onClick={() =>handleDelete(book.id)}>Delete</button>
                        <button className='update' >
                            <Link to={`/update/${book.id}`}>Update</Link>
                        </button>
                    </div>
                ))
            }
        </div>
        <button>
            <Link to={"/add"}>Add new Book</Link>
        </button>
    </div>
  )
}

export default Books