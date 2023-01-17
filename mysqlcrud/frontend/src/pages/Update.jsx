import React, {useState} from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'


const Update = () => {
    const navigate = useNavigate()
    const location =useLocation()
   const bookId = location.pathname.split("/")[2]
   console.log(bookId)
    const [book, setBook] = useState({
      title:"",
      description:"",
      price:null,
      cover:""
    })
    const handleChange = (e) => {
      setBook((prev) => ({...prev, [e.target.name]:e.target.value}))
    }
    const handleClick = async (e) => {
      e.preventDefault()
      try{
          const response = await axios.put(`http://localhost:8800/books/${bookId}`, book)
          console.log(response)
          navigate("/")
      }catch(error){
          console.log("Error!", error)
      }
  
    }
    //console.log(book)
    return (
      <div className='form'> 
          <h1>Update this Book</h1>
          <input type="text" placeholder='title' name="title" onChange={handleChange}/>
          <input type="textarea" placeholder='description' name="description" onChange={handleChange}/>
          <input type="number" placeholder='price' name="price"onChange={handleChange}/>
          <input type="text" placeholder='cover Image Url' name="cover"onChange={handleChange}/>
          <button className='formButton' onClick={handleClick}>Update Details</button>
      </div>
      
    )
}

export default Update