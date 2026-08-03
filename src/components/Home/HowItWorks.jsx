import "./HowItWorks.css";
import {
    FaUserPlus,
    FaUserEdit,
    FaRobot,
    FaBriefcase
} from "react-icons/fa";

function HowItWorks() {

    const steps = [

        {
            number: "01",
            icon: <FaUserPlus />,
            title: "Create an Account",
            description:
                "Register securely to access your personalized PrepVerse AI dashboard."
        },

        {
            number: "02",
            icon: <FaUserEdit />,
            title: "Complete Your Profile",
            description:
                "Update your education, skills, interests and career goals."
        },

        {
            number: "03",
            icon: <FaRobot />,
            title: "Use AI Tools",
            description:
                "Analyze resumes, chat with the AI Career Assistant and generate personalized skill roadmaps."
        },

        {
            number: "04",
            icon: <FaBriefcase />,
            title: "Achieve Career Goals",
            description:
                "Improve your resume and prepare confidently for placements using AI insights."
        }

    ];

    return (

        <section id="how" className="how-section">

            <div className="container">

                <div className="section-header">

                    <span className="section-badge">
                        How It Works
                    </span>

                    <h2>

                        Four Simple Steps
                        <br />
                        To Get Started

                    </h2>

                    <p>

                        Begin your career preparation journey with
                        PrepVerse AI in just four easy steps.

                    </p>

                </div>

                <div className="timeline">

                    {

                        steps.map((step, index) => (

                            <div
                                className="timeline-card"
                                key={index}
                            >

                                <div className="step-number">

                                    {step.number}

                                </div>

                                <div className="step-icon">

                                    {step.icon}

                                </div>

                                <h4>

                                    {step.title}

                                </h4>

                                <p>

                                    {step.description}

                                </p>

                            </div>

                        ))

                    }

                </div>

            </div>

        </section>

    );

}

export default HowItWorks;