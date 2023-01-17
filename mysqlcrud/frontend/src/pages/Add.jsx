import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Add = () => {
  const navigate = useNavigate()

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
        const response = await axios.post("http://localhost:8800/books", book)
        console.log(response)
        navigate("/")
    }catch(error){
        console.log("Error!", error)
    }

  }
  //console.log(book)
  return (
    <div className='form'> 
        <h1>Add a new Book</h1>
        <input type="text" placeholder='title' name="title" onChange={handleChange}/>
        <input type="textarea" placeholder='description' name="description" onChange={handleChange}/>
        <input type="number" placeholder='price' name="price"onChange={handleChange}/>
        <input type="text" placeholder='cover Image Url' name="cover"onChange={handleChange}/>
        <button onClick={handleClick}>Add</button>
    </div>
    
  )
}

export default Add