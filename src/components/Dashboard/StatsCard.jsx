import "./StatsCard.css";

function StatsCard({ icon: Icon, title, value, description, accent }) {
    return (
        <article className="stats-card" style={{ borderTopColor: accent }}>
            <div className="stats-icon" style={{ color: accent }}>
                <Icon />
            </div>
            <div>
                <h3>{title}</h3>
                <p className="stats-value">{value}</p>
                <p className="stats-description">{description}</p>
            </div>
        </article>
    );
}

export default StatsCard;
