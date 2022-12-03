import React from 'react'
import "./Footer.scss"


function Footer() {
  return (
    <div className='footer'>
      <div className="top">
        <div className="item">
          <h1>Categories</h1>
          <span>Women</span>
          <span>Men</span>
          <span>Children</span>
          <span>Accessories</span>
          <span>New Arrivals</span>
        </div>
        <div className="item">
          <h1>Links</h1>
          <span>FAQ</span>
          <span>Pages</span>
          <span>Stores</span>
          <span>Compare</span>
          <span>Cookies</span>
        </div>
        <div className="item">
          <h1>About</h1>
          <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laudantium labore consectetur. Blanditiis excepturi pariatur modi rem sunt animi laboriosam, voluptatibus obcaecati, in quae esse eveniet placeat ratione nostrum atque neque tempore. Accusamus ipsum explicabo quod dicta vel modi dolores doloribus, aliquam laudantium sed consequatur necessitatibus maiores consectetur molestiae facilis.</span>
        </div>
        <div className="item">
          <h1>Contact</h1>
          <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laudantium labore consectetur. Blanditiis excepturi pariatur modi rem sunt animi laboriosam, voluptatibus obcaecati, in quae esse eveniet placeat ratione nostrum atque neque tempore. Accusamus ipsum explicabo quod dicta vel modi dolores doloribus, aliquam laudantium sed consequatur necessitatibus maiores consectetur molestiae facilis.</span>
        </div>
      </div>
      <div className="bottom">
        <div className="left">
          <span className='logo'>Buenas Store</span>
          <span className="copyright">
            Ⓒ Copyright 2023. All Rights Reserved 
          </span>
        </div>
        <div className="right">
          <img src="/images/payment.png" alt='Payment'/>
        </div>
      </div>
    </div>
  )
}

export default Footer