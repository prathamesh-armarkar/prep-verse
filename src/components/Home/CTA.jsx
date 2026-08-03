import "./CTA.css";
import { FaArrowRight, FaRobot } from "react-icons/fa";

function CTA({ openAuth }) {

    return (

        <section className="cta-section">

            <div className="container">

                <div className="cta-box">

                    <div className="row align-items-center">

                        {/* Left */}

                        <div className="col-lg-8">

                            <span className="cta-badge">

                                <FaRobot />

                                AI Powered Career Assistance

                            </span>

                            <h2>

                                Take the Next Step Toward
                                <br />
                                <span>Your Dream Career</span>

                            </h2>

                            <p>

                                Join PrepVerse AI to analyze your resume,
                                receive AI-powered career guidance,
                                and generate personalized skill roadmaps
                                from one intelligent platform.

                            </p>

                        </div>

                        {/* Right */}

                        <div className="col-lg-4">

                            <div className="cta-buttons">

                                <button
                                    type="button"
                                    className="cta-primary"
                                    onClick={() => openAuth("register")}
                                >

                                    Get Started

                                    <FaArrowRight />

                                </button>

                                <a
                                    href="#features"
                                    className="cta-secondary"
                                >

                                    Explore Features

                                </a>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}

export default CTA;