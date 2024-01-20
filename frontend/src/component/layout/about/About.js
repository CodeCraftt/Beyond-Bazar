import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/meabhisingh";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dahkivzln/image/upload/v1699620463/avatars/pro_rts8ma.jpg"
              alt="Founder"
            />
            
            <Typography>Bhargav rathod</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit LinkedIn
            </Button>
            <span>
            I am a proactive B.Tech student majoring in Computer Science at the esteemed Indian Institute of Information Technology, Pune. While I am currently exploring various facets of technology, my interests gravitate towards Full Stack Web Development, Cryptography, and Machine Learning. I am enthusiastic about gaining hands-on experience in these fields and continuously expanding my skill set. Eager to embrace challenges, learn, and contribute to innovative projects in the dynamic world of technology.
            </span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default About;