import React from 'react'
import { Link } from 'react-router-dom'


import "./Categories.scss"

const Categories = () => {
  return (
    <div className='categories'>
        <div className="col">
            <div className="row">
                <img src="https://i.ibb.co/h79LrJD/T-Shirt.jpg" alt="" />
                <button>
                    <Link className='link' to="/products/1">Sale</Link>
                </button>
            </div>
            <div className="row">
                <img src="https://i.ibb.co/MyddYHc/Watch.jpg" alt="" />
                <button>
                    <Link className='link' to="/products/1">Watch</Link>
                </button>
            </div>
        </div>
        <div className="col">
        <div className="row">
            <img src="https://i.ibb.co/NFfj5k7/shoes.jpg" alt="" />
            <button>
                <Link className='link' to="/products/1">Shoes</Link>
            </button>
        </div>
        </div>
        <div className="col col-l">
            <div className="row">
                <div className="col">
                    <div className="row">
                        <img src="https://i.ibb.co/nnH3WgQ/placeholder4.jpg" alt="" />
                        <button>
                            <Link className='link' to="/products/1">Sale</Link>
                        </button>
                    </div>
                </div>
                <div className="col">
                    <div className="row">
                        <img src="https://i.ibb.co/dBH0hrd/placeholder2.jpg" alt="" />
                        <button>
                            <Link className='link' to="/products/1">Sale</Link>
                        </button>
                    </div>
                </div>
            </div>
            <div className="row">
                <img src="https://i.ibb.co/0Q0G12D/placeholder.jpg" alt="" />
                <button>
                    <Link className='link' to="/products/1">Sale</Link>
                </button>
            </div>
        </div>
    </div>
  )
}


export default Categories