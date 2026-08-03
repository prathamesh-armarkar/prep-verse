import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { PageHeader, StatsCard, ProgressCard, ChartCard, Timeline } from "../../components/Common/ReusableComponents";
import { FaBrain, FaChartLine, FaClock, FaGraduationCap, FaRocket } from "react-icons/fa";
import "./CareerInsights.css";

const readinessStats = [
    { label: "Career Readiness", value: "84%", change: "+8% this month", icon: <FaRocket />, accent: "blue" },
    { label: "Skill Growth", value: "73%", change: "+5 skills", icon: <FaGraduationCap />, accent: "green" },
    { label: "Weekly Learning", value: "12h", change: "Steady pace", icon: <FaClock />, accent: "amber" }
];

const progressData = [
    { title: "Java Core", percent: 88, detail: "Strong grasp on OOP and collections" },
    { title: "DSA", percent: 68, detail: "Need more daily problem solving" },
    { title: "System Design", percent: 45, detail: "Begin with database and API fundamentals" }
];

const timelineItems = [
    { title: "Resume polish", date: "Today", status: "In progress" },
    { title: "Mock interview", date: "Tomorrow", status: "Scheduled" },
    { title: "Project showcase", date: "This week", status: "Recommended" }
];

function CareerInsights() {
    return (
        <DashboardLayout>
            <div className="career-insights-page">
                <PageHeader
                    eyebrow="Career Insights"
                    title="Your growth is trending in the right direction"
                    subtitle="A calm view of readiness, progress, and the next best opportunities."
                />

                <section className="insights-grid stats-grid">
                    {readinessStats.map((item) => (
                        <StatsCard key={item.label} {...item} />
                    ))}
                </section>

                <section className="insights-grid two-column">
                    <ChartCard title="Weekly progress" subtitle="Momentum across learning goals">
                        <div className="insight-bars">
                            {[72, 88, 65, 81, 92, 76].map((value, index) => (
                                <div key={index} className="insight-bar-wrap">
                                    <div className="insight-bar" style={{ height: `${value}%` }} />
                                    <span>{["M", "T", "W", "T", "F", "S"][index]}</span>
                                </div>
                            ))}
                        </div>
                    </ChartCard>

                    <ChartCard title="Interview readiness" subtitle="Confidence and preparation balance">
                        <div className="readiness-ring">
                            <div className="ring-core">
                                <FaBrain />
                                <strong>81%</strong>
                            </div>
                        </div>
                    </ChartCard>
                </section>

                <section className="insights-grid two-column">
                    <div className="panel-stack">
                        <h3>Skill progress</h3>
                        {progressData.map((item) => (
                            <ProgressCard key={item.title} {...item} />
                        ))}
                    </div>

                    <div className="panel-stack">
                        <h3>Recommended next actions</h3>
                        <Timeline items={timelineItems} />
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

export default CareerInsights;
