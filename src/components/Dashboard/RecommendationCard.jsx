import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./RecommendationCard.css";

function RecommendationCard({ recommendation = null }) {
    const navigate = useNavigate();

    if (!recommendation) {
        return (
            <section className="recommendation-card">
                <div>
                    <p className="recommendation-label">Today&apos;s AI Recommendation</p>
                    <h3>Upload your resume to get started</h3>
                    <p>
                        PrepVerse will analyse your resume and give you an ATS score, skill insights, and personalised recommendations.
                    </p>
                </div>
                <button
                    type="button"
                    className="recommendation-btn"
                    onClick={() => navigate("/resume-analyzer")}
                >
                    Upload Resume <FaArrowRight />
                </button>
            </section>
        );
    }

    return (
        <section className="recommendation-card">
            <div>
                <p className="recommendation-label">Today&apos;s AI Recommendation</p>
                <h3>{recommendation.title}</h3>
                <p>{recommendation.description}</p>
            </div>
            {recommendation.link && (
                <button
                    type="button"
                    className="recommendation-btn"
                    onClick={() => navigate(recommendation.link)}
                >
                    {recommendation.action || "View"} <FaArrowRight />
                </button>
            )}
        </section>
    );
}

export default RecommendationCard;
