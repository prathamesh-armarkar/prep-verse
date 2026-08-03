import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { PageHeader, StatsCard, ActionCard, ProgressCard, Timeline, LoadingSkeleton } from "../../components/Common/ReusableComponents";
import { FaBook, FaCertificate, FaClock, FaPlus, FaRocket, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { roadmapService } from "../../services/roadmapService";
import "./SkillRoadmap.css";

const LEVELS = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
];

function SkillRoadmap() {
    const { user, token } = useAuth();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formGoal, setFormGoal] = useState("");
    const [formLevel, setFormLevel] = useState("intermediate");

    // Load latest roadmap on mount
    const loadLatest = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        setError("");
        try {
            const latest = await roadmapService.getLatest(token);
            setRoadmap(latest);
        } catch {
            // No roadmap yet - show form
            setRoadmap(null);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { loadLatest(); }, [loadLatest]);

    const handleGenerate = async () => {
        if (!formGoal.trim()) return;
        setGenerating(true);
        setError("");
        try {
            const result = await roadmapService.generate(formGoal.trim(), formLevel, token);
            setRoadmap({
                ...result,
                career_goal: formGoal.trim(),
                current_level: formLevel,
            });
            setShowForm(false);
            setFormGoal("");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to generate roadmap. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handleNewRoadmap = () => {
        setShowForm(true);
        setError("");
    };

    const roadmapData = roadmap?.roadmap ?? roadmap;
    const weeks = roadmapData?.weeks || [];
    const milestones = roadmapData?.milestones || [];
    const certifications = roadmapData?.certifications || [];
    const completionPct = roadmap?.completion_percentage ?? 0;

    // Stats derived from roadmap data
    const stats = roadmapData ? [
        { label: "Focus Area", value: roadmap?.career_goal || "Career goal", change: roadmapData?.difficulty ? `${roadmapData.difficulty} level` : "Custom", icon: <FaRocket />, accent: "blue" },
        { label: "Timeline", value: `${roadmapData?.total_weeks || 0} Weeks`, change: `${roadmapData?.estimated_hours_per_week || 0}h/week`, icon: <FaClock />, accent: "green" },
        { label: "Certs", value: `${certifications.length} Planned`, change: "Industry aligned", icon: <FaCertificate />, accent: "amber" },
    ] : [];

    // Learning milestones for timeline
    const timelineItems = weeks
        .filter((w) => w.type === "project" || w.type === "assessment")
        .map((w) => ({
            title: w.topic,
            date: `Week ${w.week}`,
            status: w.type === "assessment" ? "Assessment" : "Project",
        }));

    // If no weeks, show project milestones
    if (timelineItems.length === 0 && milestones.length > 0) {
        milestones.forEach((m, i) => {
            timelineItems.push({
                title: m,
                date: `Milestone ${i + 1}`,
                status: "Project",
            });
        });
    }

    return (
        <DashboardLayout>
            <div className="skill-roadmap-page">
                <PageHeader
                    eyebrow="Skill Roadmap"
                    title="A guided learning path built for ambitious career goals"
                    subtitle="Generate a personalised, week-by-week roadmap powered by AI."
                    action={
                        !showForm && (
                            <button type="button" className="roadmap-action-btn" onClick={handleNewRoadmap}>
                                <FaPlus /> New Roadmap
                            </button>
                        )
                    }
                />

                {error && (
                    <div className="roadmap-alert">
                        <span>{error}</span>
                        <button type="button" onClick={() => setError("")}>Dismiss</button>
                    </div>
                )}

                {loading ? (
                    <section className="skill-grid"><LoadingSkeleton lines={6} /></section>
                ) : showForm || !roadmap ? (
                    <section className="roadmap-form-card">
                        <div className="roadmap-form-header">
                            <h3>{roadmap ? "Generate New Roadmap" : "Create Your First Roadmap"}</h3>
                            <p>Tell us your career goal and experience level, and PrepVerse AI will build a custom learning path.</p>
                        </div>
                        <div className="roadmap-form-body">
                            <div className="roadmap-form-field">
                                <label htmlFor="career-goal">Career Goal</label>
                                <input
                                    id="career-goal"
                                    type="text"
                                    placeholder="e.g. Java Full Stack Developer, Data Scientist"
                                    value={formGoal}
                                    onChange={(e) => setFormGoal(e.target.value)}
                                    disabled={generating}
                                />
                            </div>
                            <div className="roadmap-form-field">
                                <label htmlFor="current-level">Current Level</label>
                                <div className="roadmap-level-options">
                                    {LEVELS.map((level) => (
                                        <button
                                            key={level.value}
                                            type="button"
                                            className={`roadmap-level-btn ${formLevel === level.value ? "active" : ""}`}
                                            onClick={() => setFormLevel(level.value)}
                                            disabled={generating}
                                        >
                                            {level.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="roadmap-generate-btn"
                                onClick={handleGenerate}
                                disabled={generating || !formGoal.trim()}
                            >
                                {generating ? (
                                    <>
                                        <FaSpinner className="spinner" /> Generating Roadmap...
                                    </>
                                ) : (
                                    <>
                                        <FaRocket /> Generate Roadmap
                                    </>
                                )}
                            </button>
                        </div>
                    </section>
                ) : (
                    <>
                        <section className="skill-grid stats-grid">
                            {stats.map((item) => (
                                <StatsCard key={item.label} {...item} />
                            ))}
                        </section>

                        {weeks.length > 0 && (
                            <section className="skill-grid two-column">
                                <div className="roadmap-card-stack">
                                    <h3>Weekly Plan ({weeks.length} weeks)</h3>
                                    {weeks.map((week) => (
                                        <div key={week.week} className="roadmap-week-card">
                                            <div className="roadmap-week-header">
                                                <span className="roadmap-week-badge">
                                                    {week.type === "project" ? "🚀" : week.type === "assessment" ? "📝" : "📚"}
                                                </span>
                                                <div>
                                                    <strong>Week {week.week}: {week.topic}</strong>
                                                    <span className="roadmap-week-type">{week.type}</span>
                                                </div>
                                            </div>
                                            {week.objectives?.length > 0 && (
                                                <ul className="roadmap-week-objectives">
                                                    {week.objectives.map((obj, i) => (
                                                        <li key={i}>{obj}</li>
                                                    ))}
                                                </ul>
                                            )}
                                            {week.resources?.length > 0 && (
                                                <div className="roadmap-week-resources">
                                                    {week.resources.map((res, i) => (
                                                        <span key={i} className="resource-chip">{res}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="roadmap-card-stack">
                                    {milestones.length > 0 && (
                                        <>
                                            <h3>Milestones</h3>
                                            <div className="roadmap-milestone-list">
                                                {milestones.map((m, i) => (
                                                    <div key={i} className="roadmap-milestone-item">
                                                        <FaRocket />
                                                        <span>{m}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {certifications.length > 0 && (
                                        <>
                                            <h3 style={{ marginTop: 20 }}>Recommended Certifications</h3>
                                            <div className="roadmap-cert-list">
                                                {certifications.map((cert, i) => (
                                                    <div key={i} className="certificate-pill">
                                                        <FaCertificate /> {cert}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {timelineItems.length > 0 && (
                                        <>
                                            <h3 style={{ marginTop: 20 }}>Project Timeline</h3>
                                            <Timeline items={timelineItems} />
                                        </>
                                    )}

                                    {/* Completion Progress */}
                                    <div className="roadmap-progress-section">
                                        <h3 style={{ marginTop: 20 }}>Overall Progress</h3>
                                        <div className="roadmap-progress-bar">
                                            <div
                                                className="roadmap-progress-fill"
                                                style={{ width: `${completionPct}%` }}
                                            />
                                        </div>
                                        <span className="roadmap-progress-label">{completionPct}% complete</span>
                                    </div>
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}

export default SkillRoadmap;

