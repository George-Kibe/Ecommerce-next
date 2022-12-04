import WestOutlinedIcon from '@mui/icons-material/WestOutlined'
import EastOutlinedIcon from '@mui/icons-material/EastOutlined'
import { useState } from 'react'

import "./Slider.scss"

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const data =[
    "https://i.ibb.co/p0c4YbL/placeholder3.jpg",
    "https://i.ibb.co/dBH0hrd/placeholder2.jpg",
    "https://i.ibb.co/Gx763XY/placeholder1.jpg",
  ]

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? 2 : (prev) => prev - 1 )
  }
  const nextSlide = () => {
    setCurrentSlide(currentSlide === 2 ? 0 : (prev) => prev + 1 )
}
  return (
    <div className='slider'>
        <div className="container"
            style={{transform:`translateX(-${currentSlide * 100}vw)`}}
        >
            <img src={data[0]} alt="" />
            <img src={data[1]} alt="" />
            <img src={data[2]} alt="" />
         </div>
         <div className="icons">
            <div className="icon">
                <WestOutlinedIcon onClick={prevSlide}/>
            </div>
            <div className="icon">
                <EastOutlinedIcon onClick={nextSlide}/>
            </div>
         </div>
    </div>
  )
}

export default Slider