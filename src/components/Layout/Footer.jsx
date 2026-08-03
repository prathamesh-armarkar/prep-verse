import "./Footer.css";
import { Link } from "react-router-dom";
import {
    FaGithub,
    FaLinkedin,
    FaEnvelope,
    FaHeart
} from "react-icons/fa";

import logo from "../../assets/logo/logo.svg";

function Footer() {

    return (

        <footer className="footer">

            <div className="container">

                <div className="row">

                    {/* Brand */}

                    <div className="col-lg-4 mb-5">

                        <img
                            src={logo}
                            alt="PrepVerse AI"
                            className="footer-logo"
                        />

                        <p className="footer-description">

                            PrepVerse AI is an AI-powered career assistance
                            platform that helps students improve resumes,
                            receive career guidance and generate
                            personalized skill roadmaps.

                        </p>

                    </div>

                    {/* Navigation */}

                    <div className="col-lg-2 col-6">

                        <h5>Navigation</h5>

                        <ul>

                            <li><a href="#home">Home</a></li>

                            <li><a href="#features">Features</a></li>

                            <li><a href="#how">How It Works</a></li>

                            <li><a href="#contact">Contact</a></li>

                        </ul>

                    </div>

                    {/* Platform */}

                    <div className="col-lg-3 col-6">

                        <h5>Platform</h5>

                        <ul>

                            <li>Resume Analysis</li>

                            <li>AI Career Assistant</li>

                            <li>Skill Roadmap</li>

                            <li>Personalized Roadmap</li>

                        </ul>

                    </div>

                    {/* Connect */}

                    <div className="col-lg-3">

                        

                        </div>

                    </div>

                </div>

                <hr />

                <div className="footer-bottom">

                    <p>

                        © 2026 PrepVerse AI. All Rights Reserved.

                    </p>

                    

                </div>

            </div>

        </footer>

    );

}

export default Footer;
