import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="footer-container">
        <div className="leftFooter">
          <h4>Contact Us</h4>
          <p>Email: bhargavrathod2425@gmail.com</p>
          <div className="app-icons">
            <img src={playStore} alt="Play Store" />
            <img src={appStore} alt="App Store" />
          </div>
        </div>

        <div className="midFooter">
          <h1>Beyond Bazar</h1>
          <p>Your One-Stop Shop, Delivered to Your Doorstep</p>
          <p>&copy; 2023 Beyond Bazar</p>
        </div>

        <div className="rightFooter">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link> 
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
