import "./RecentActivity.css";

function RecentActivity({ activities = [] }) {
    return (
        <section className="dashboard-panel">
            <div className="panel-header">
                <h3>Recent Activity</h3>
                <span>Live updates</span>
            </div>

            <div className="activity-list">
                {activities.length === 0 ? (
                    <div className="activity-item">
                        <div className="activity-dot" />
                        <div className="activity-content">
                            <div className="activity-title-row">
                                <strong>No activity yet</strong>
                                <span>—</span>
                            </div>
                            <p>Upload a resume or chat with PrepVerse AI to see your activity here.</p>
                        </div>
                    </div>
                ) : (
                    activities.map((item, index) => (
                        <div className="activity-item" key={index}>
                            <div className="activity-dot" />
                            <div className="activity-content">
                                <div className="activity-title-row">
                                    <strong>{item.title}</strong>
                                    <span>{item.time}</span>
                                </div>
                                <p>{item.detail}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export default RecentActivity;
