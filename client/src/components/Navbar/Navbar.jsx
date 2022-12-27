import React, {useState} from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from "@mui/icons-material/Search"
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined"
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Link } from 'react-router-dom';
import Cart from '../Cart/Cart';

import "./Navbar.scss"

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <div className='navbar'>
        <div className="wrapper">
            <div className="left">
                <div className="item">
                    <img src='/images/kenya.png' alt="flag" style={{height:20, width:30}}/>
                    <KeyboardArrowDownIcon />
                </div>
                <div className="item">
                    <span>KES</span>
                    <KeyboardArrowDownIcon/>
                </div>
                <div className="item">
                    <Link className="link" to="/products/1">Women</Link>
                </div>
                <div className="item">
                    <Link className="link"  to="/products/2">Men</Link>
                </div>             
                <div className="item">
                    <Link className="link"  to="/products/3">Children</Link>
                </div> 
            </div>
            <div className="center">
                <Link className="link"  to="/">BUENAS STORE</Link>
            </div>
            <div className="right">
                <div className="item">
                    <Link className="link"  to="/">HomePage</Link>
                </div>
                <div className="item">
                    <Link className="link"  to="/">About</Link>
                </div>
                <div className="item">
                    <Link className="link"  to="/">Contact</Link>
                </div>
                <div className="item">
                    <Link className="link" to="/">Stores</Link>
                </div>
                <div className="icons">
                    <SearchIcon/>
                    <PersonOutlineOutlinedIcon/>
                    <FavoriteBorderOutlinedIcon/>
                    <div className="cartIcon" onClick={() => setOpen(!open)}>
                        <ShoppingCartOutlinedIcon/>
                        <span>0</span>
                    </div>
                </div>                
            </div>
        </div> 
        {open && <Cart />}    
    </div>
  )
}

export default Navbar