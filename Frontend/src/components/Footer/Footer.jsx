import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer_content">
        <div className="footer_content_left">
            <img src={assets.logo} alt="" />
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim commodi exercitationem error facere, obcaecati magni itaque sapiente laudantium nihil eveniet quasi quis temporibus ut voluptatibus possimus dignissimos voluptate! Sequi, beatae.
            </p>
            <div className="footer_social_icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
            </div>
        </div>
        <div className="footer_content_center">
        <h2>COMPANY</h2>
        <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
        </ul>
        </div>
        <div className="footer_content_right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91-7060934243</li>
                <li>contact-ankitkumar62601@gmail.com</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer_copyright">
        Copyright 2024 Tomato.com - All Right Reserved
      </p>
    </div>
  )
}

export default Footer
