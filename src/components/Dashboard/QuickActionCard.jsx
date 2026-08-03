import "./QuickActionCard.css";

function QuickActionCard({ icon: Icon, title, description, onClick }) {
    return (
        <button type="button" className="quick-action-card" onClick={onClick}>
            <div className="quick-action-icon">
                <Icon />
            </div>
            <div className="quick-action-text">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </button>
    );
}

export default QuickActionCard;
