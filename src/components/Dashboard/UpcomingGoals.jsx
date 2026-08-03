import "./UpcomingGoals.css";

function UpcomingGoals({ goals = [] }) {
    return (
        <section className="dashboard-panel">
            <div className="panel-header">
                <h3>Upcoming Goals</h3>
                <span>{goals.length} task{goals.length !== 1 ? "s" : ""}</span>
            </div>

            <ul className="goals-list">
                {goals.length === 0 ? (
                    <li className="goal-item">
                        <span className="goal-check">○</span>
                        <span>Upload a resume to get personalised goals</span>
                    </li>
                ) : (
                    goals.map((goal, index) => (
                        <li key={index} className={`goal-item ${goal.done ? "done" : ""}`}>
                            <span className="goal-check">{goal.done ? "✓" : "○"}</span>
                            <span>{goal.title}</span>
                        </li>
                    ))
                )}
            </ul>
        </section>
    );
}

export default UpcomingGoals;
