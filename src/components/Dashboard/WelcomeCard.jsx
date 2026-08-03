import { FaStar } from "react-icons/fa";
import "./WelcomeCard.css";

function WelcomeCard({ firstName = "User" }) {
    return (
        <section className="welcome-card">
            <div className="welcome-card-content">
                <div>
                    <p className="welcome-eyebrow">Dashboard Overview</p>
                    <h2>Hi {firstName}, welcome back 👋</h2>
                    <p>
                        Your prep journey is on track. Keep going and let PrepVerse AI guide your next move.
                    </p>
                </div>
                <div className="welcome-badge">
                    <FaStar />
                    <span>Weekly Focus</span>
                </div>
            </div>
        </section>
    );
}

export default WelcomeCard;
