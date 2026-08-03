import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import WelcomeCard from "../../components/Dashboard/WelcomeCard";
import StatsCard from "../../components/Dashboard/StatsCard";
import QuickActionCard from "../../components/Dashboard/QuickActionCard";
import RecentActivity from "../../components/Dashboard/RecentActivity";
import RecommendationCard from "../../components/Dashboard/RecommendationCard";
import UpcomingGoals from "../../components/Dashboard/UpcomingGoals";
import { FaRobot, FaClipboardCheck, FaSpinner, FaUserCheck, FaMap, FaBullseye } from "react-icons/fa6";
import { FaFileAlt, FaSync } from "react-icons/fa";
import { dashboardService } from "../../services/dashboardService";
import "./Dashboard.css";

// Icon map matching the backend icon string names
const ICON_MAP = {
    FaFileAlt, FaUserCheck, FaMap, FaBullseye,
};

function Dashboard() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const firstName = user?.first_name || "User";

    const loadDashboard = useCallback(async () => {
        if (!token) { setLoading(false); return; }
        setLoading(true);
        setError("");
        try {
            const result = await dashboardService.getDashboard(token);
            setData(result);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Could not load dashboard data.");
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { loadDashboard(); }, [loadDashboard]);

    // Resolve icon string to component
    const resolveIcon = (iconName) => {
        return ICON_MAP[iconName] || FaFileAlt;
    };

    // Quick action click handlers
    const actionHandlers = {
        "/resume-analyzer": () => navigate("/resume-analyzer"),
        "/assistant": () => navigate("/assistant"),
        "/skill-roadmap": () => navigate("/skill-roadmap"),
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="dashboard-loading">
                    <FaSpinner className="dashboard-spinner" />
                    <p>Loading your dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    const stats = data?.stats || [];
    const quickActions = data?.quick_actions || [];
    const recentActivity = data?.recent_activity || [];
    const recommendation = data?.recommendation || null;
    const upcomingGoals = data?.upcoming_goals || [];

    return (
        <DashboardLayout>
            <div className="dashboard-home">
                <WelcomeCard firstName={firstName} />

                {error && (
                    <div className="dashboard-alert">
                        <span>{error}</span>
                        <button type="button" onClick={loadDashboard}><FaSync /> Retry</button>
                    </div>
                )}

                <section className="dashboard-grid">
                    <div className="stats-grid">
                        {stats.length === 0 ? (
                            <>
                                <StatsCard icon={FaFileAlt} title="Resume Score" value="—" description="Upload a resume to get started" accent="#2563eb" />
                                <StatsCard icon={FaUserCheck} title="Profile Completion" value="0%" description="Start by uploading your resume" accent="#0ea5e9" />
                                <StatsCard icon={FaMap} title="Roadmap Progress" value="—" description="Generate a skill roadmap" accent="#8b5cf6" />
                                <StatsCard icon={FaBullseye} title="Career Readiness" value="—" description="Complete your profile to see readiness" accent="#10b981" />
                            </>
                        ) : (
                            stats.map((item) => (
                                <StatsCard
                                    key={item.title}
                                    icon={resolveIcon(item.icon)}
                                    title={item.title}
                                    value={item.value}
                                    description={item.description}
                                    accent={item.accent}
                                />
                            ))
                        )}
                    </div>

                    <div className="quick-actions-grid">
                        {quickActions.map((action) => (
                            <QuickActionCard
                                key={action.title}
                                icon={resolveIcon(action.icon)}
                                title={action.title}
                                description={action.description}
                                onClick={actionHandlers[action.link] || (() => {})}
                            />
                        ))}
                    </div>
                </section>

                <section className="dashboard-lower-grid">
                    <RecentActivity activities={recentActivity} />
                    <RecommendationCard recommendation={recommendation} />
                    <UpcomingGoals goals={upcomingGoals} />
                </section>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;
