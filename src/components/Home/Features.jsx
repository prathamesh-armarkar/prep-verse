import "./Features.css";
import {
    FaRobot,
    FaFileAlt,
    FaRoute,
    FaBullseye
} from "react-icons/fa";

function Features() {

    const features = [

        {
            icon: <FaRobot />,
            title: "AI Career Assistant",
            description:
                "Get instant AI-powered career guidance, interview preparation tips and placement assistance."
        },

        {
            icon: <FaFileAlt />,
            title: "Resume Analysis",
            description:
                "Analyze your resume using AI and receive ATS-friendly suggestions for improvement."
        },

        {
            icon: <FaRoute />,
            title: "Skill Roadmap",
            description:
                "Generate a structured roadmap based on your target role and required technical skills."
        },

        {
            icon: <FaBullseye />,
            title: "Personalized Roadmap",
            description:
                "Receive customized recommendations based on your profile and career objectives."
        }

    ];

    return (

        <section
            id="features"
            className="features-section"
        >

            <div className="container">

                <div className="section-header">

                    <span className="section-badge">
                        Our Features
                    </span>

                    <h2>
                        Everything You Need
                        <br />
                        To Become Career Ready
                    </h2>

                    <p>
                        Powerful AI tools designed to help students prepare
                        smarter for placements and career growth.
                    </p>

                </div>

                <div className="row g-4">

                    {

                        features.map((feature, index) => (

                            <div
                                className="col-lg-3 col-md-6"
                                key={index}
                            >

                                <div className="feature-card">

                                    <div className="feature-icon">

                                        {feature.icon}

                                    </div>

                                    <h4>

                                        {feature.title}

                                    </h4>

                                    <p>

                                        {feature.description}

                                    </p>

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>

        </section>

    );

}

export default Features;