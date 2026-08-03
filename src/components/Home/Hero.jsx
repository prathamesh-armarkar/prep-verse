import "./Hero.css";
import { FaArrowRight } from "react-icons/fa";

import heroImage from "../../assets/images/hero.svg";

function Hero({ openAuth }) {

    return (

        <section id="home" className="hero-section">

            <div className="container">

                <div className="row align-items-center">

                    {/* Left Content */}

                    <div className="col-lg-6">

                        <span className="hero-badge">
                            🚀 AI Powered Career Assistance Platform
                        </span>

                        <h1 className="hero-title">
                            Prepare Smarter.
                            <br />
                            <span>Get Career Ready.</span>
                        </h1>

                        <p className="hero-description">

                            PrepVerse AI is an AI-powered career assistance platform that helps students analyze resumes, chat with an AI career assistant, generate personalized skill roadmaps, and manage their career preparation from one intelligent dashboard.

                        </p>

                        <div className="hero-buttons">

                            <button
                                type="button"
                                className="btn btn-primary btn-lg"
                                onClick={() => openAuth("register")}
                            >
                                Get Started
                                <FaArrowRight className="ms-2" />
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-primary btn-lg"
                                onClick={() => openAuth("login")}
                            >
                                Login
                            </button>

                        </div>

                        {/* Feature Tags */}

                        <div className="feature-tags">

                            <span>📄 Resume Analysis</span>

                            <span>🤖 AI Career Assistant</span>

                            <span>🗺️ Skill Roadmap</span>

                            <span>🎯 Personalized Roadmap</span>

                        </div>

                    </div>

                    {/* Right Side */}

                    <div className="col-lg-6">

                        <div className="hero-image">

                            <img
                                src={heroImage}
                                alt="PrepVerse AI Hero"
                                className="img-fluid"
                            />

                            <div className="floating-card score">

                                <h6>Resume Analysis</h6>

                                <p>ATS Score & Suggestions</p>

                            </div>

                            <div className="floating-card interview">

                                <h6>AI Career Assistant</h6>

                                <p>Career Guidance</p>

                            </div>

                            <div className="floating-card roadmap">

                                <h6>Skill Roadmap</h6>

                                <p>Personalized Learning Path</p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default Hero;