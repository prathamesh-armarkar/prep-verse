import { useEffect, useRef, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { FaArrowDown, FaArrowUp, FaCheck, FaCloudUploadAlt, FaDownload, FaExpand, FaFileAlt, FaSearchPlus, FaTrashAlt } from "react-icons/fa";
import { useResume } from "../../hooks/useResume";

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip);
const value = (data, key, fallback = "—") => data?.[key] ?? fallback;
const list = (data, key) => Array.isArray(data?.[key]) ? data[key] : [];
const date = (input) => input ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(input)) : "—";
const scoreClass = (score) => score >= 90 ? "excellent" : score >= 75 ? "good" : score >= 60 ? "average" : "needs-work";

export function ResumeUpload() {
    const { upload, uploading, progress, error, setError } = useResume();
    const inputRef = useRef();
    const [dragging, setDragging] = useState(false);
    const [stage, setStage] = useState(0);
    const [targetRole, setTargetRole] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const stages = ["Uploading resume", "Parsing resume", "Extracting skills", "Analyzing sections", "Building dashboard"];
    useEffect(() => { if (!uploading) return undefined; const id = setInterval(() => setStage((current) => Math.min(current + 1, stages.length - 1)), 850); return () => clearInterval(id); }, [uploading, stages.length]);
    const choose = async (file) => {
        if (!file) return;
        if (!targetRole.trim()) {
            setError("Please enter your target job role before uploading.");
            return;
        }
        const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!allowed.includes(file.type)) return setError("Please choose a PDF, DOC, or DOCX resume.");
        if (file.size > 5 * 1024 * 1024) return setError("Your resume must be 5 MB or smaller.");
        setStage(0);
        try { await upload(file, targetRole.trim(), jobDescription.trim()); }
        catch { /* context displays the server error */ }
    };
    return <section className="resume-card upload-card">
        <div className="card-title-row"><div><p className="card-kicker">Resume upload</p><h3>Keep your best version analyzed</h3></div><span className="support-pill">PDF · DOC · DOCX · 5 MB</span></div>
        <div className="upload-fields">
            <div className="upload-field-group">
                <label htmlFor="target-role">Target Role <span className="required">*</span></label>
                <input id="target-role" type="text" className="upload-input" placeholder="e.g. Full Stack Developer, Data Scientist" value={targetRole} onChange={(event) => setTargetRole(event.target.value)} disabled={uploading} />
            </div>
            <div className="upload-field-group">
                <label htmlFor="job-description">Job Description <span className="optional">(optional)</span></label>
                <textarea id="job-description" className="upload-textarea" placeholder="Paste the job description here for targeted ATS analysis…" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} disabled={uploading} rows={3} />
            </div>
        </div>
        <div className={`upload-zone-large ${dragging ? "is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); choose(event.dataTransfer.files[0]); }}>
            <FaCloudUploadAlt /><strong>{uploading ? stages[stage] : "Drop your resume here"}</strong><p>{uploading ? "Your analysis starts automatically when upload completes." : "or select a file from your device"}</p>
            {uploading ? <><div className="upload-progress"><span style={{ width: `${progress}%` }} /></div><small>{progress}% complete</small></> : <button type="button" className="primary-btn" onClick={() => inputRef.current.click()}>Browse files</button>}
            <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={(event) => choose(event.target.files[0])} />
        </div>
        {error && <div className="resume-alert"><span>{error}</span><button type="button" onClick={() => setError("")}>Dismiss</button></div>}
    </section>;
}

export function ATSGauge({ score = 0, confidence }) {
    const [displayed, setDisplayed] = useState(0); const color = score >= 90 ? "#10b981" : score >= 75 ? "#2563eb" : score >= 60 ? "#f59e0b" : "#ef4444";
    useEffect(() => { const start = performance.now(); const timer = requestAnimationFrame(function tick(now) { const next = Math.min(score, Math.round(score * Math.min((now - start) / 700, 1))); setDisplayed(next); if (next < score) requestAnimationFrame(tick); }); return () => cancelAnimationFrame(timer); }, [score]);
    return <section className="resume-card score-card"><div className="card-title-row"><div><p className="card-kicker">ATS compatibility</p><h3>Overall score</h3></div><span className={`grade ${scoreClass(score)}`}>{score >= 90 ? "Excellent" : score >= 75 ? "Good" : score >= 60 ? "Average" : "Needs work"}</span></div><div className="score-ring" style={{ background: `conic-gradient(${color} ${displayed}%, #e8eef7 0)` }}><div className="score-ring-inner"><strong>{displayed}</strong><span>out of 100</span></div></div><p className="score-copy">A weighted read of your resume’s content, clarity, and keyword relevance.</p>{confidence != null && <small className="confidence">Analysis confidence <strong>{confidence}%</strong></small>}</section>;
}

export function ResumeOverview() {
    const { resume, deleteResume } = useResume();
    const download = () => { if (resume?.download_url || resume?.file_url) window.open(resume.download_url || resume.file_url, "_blank", "noopener,noreferrer"); };
    return <section className="resume-card overview-card"><div className="card-title-row"><div><p className="card-kicker">Active resume</p><h3>{value(resume, "file_name", "Resume file")}</h3></div><span className="status-pill">{value(resume, "status", "Analyzed")}</span></div><div className="overview-grid">{[["Candidate", value(resume, "candidate_name")], ["Target role", value(resume, "target_role")], ["Email", value(resume, "email")], ["Experience", value(resume, "experience")], ["Education", value(resume, "education")], ["File size", value(resume, "file_size")], ["Uploaded", date(resume?.uploaded_at)], ["Updated", date(resume?.updated_at)]].map(([label, content]) => <div key={label}><span>{label}</span><strong>{content}</strong></div>)}</div><div className="card-actions"><button type="button" className="secondary-btn" onClick={download}><FaDownload /> Download</button><button type="button" className="danger-btn" onClick={() => deleteResume(resume.id)}><FaTrashAlt /> Delete</button></div></section>;
}

export function MetricBreakdown({ analysis }) {
    const metrics = list(analysis, "ats_breakdown");
    return <section className="resume-card"><div className="card-title-row"><div><p className="card-kicker">ATS breakdown</p><h3>Where the score comes from</h3></div></div><div className="breakdown-grid">{metrics.map((item) => <div className="metric-card" key={item.name}><div><strong>{item.name}</strong><b>{item.score}%</b></div><div className="mini-progress"><span style={{ width: `${item.score}%` }} /></div><p>{item.tip}</p></div>)}</div></section>;
}

export function SkillAnalysis({ analysis }) {
    const groups = [["Matched skills", list(analysis, "matched_skills"), "matched"], ["Missing skills", list(analysis, "missing_skills"), "missing"], ["Recommended", list(analysis, "recommended_skills"), "recommended"]];
    const [selected, setSelected] = useState(null);
    return <section className="resume-card"><p className="card-kicker">Skill intelligence</p><h3>Skills mapped to your target</h3><div className="skills-groups">{groups.map(([title, skills, type]) => <div key={title}><h4>{title} <span>{skills.length}</span></h4><div className="skill-chip-list">{skills.map((skill) => { const item = typeof skill === "string" ? { name: skill } : skill; return <button type="button" onClick={() => setSelected(item)} className={`skill-chip ${type}`} key={item.name}>{item.name}</button>; })}</div></div>)}</div>{selected && <div className="skill-detail"><strong>{selected.name}</strong><span>{selected.reason || "Skill relevance is available after the analysis completes."}</span>{selected.importance && <small>Importance: {selected.importance} · Market demand: {selected.market_demand || "—"}</small>}</div>}</section>;
}

export function KeywordAnalysis({ analysis }) {
    const keywords = list(analysis, "keyword_analysis"); const labels = keywords.map((x) => x.name); const matched = keywords.map((x) => x.matched ?? 0); const missing = keywords.map((x) => x.missing ?? 0);
    const chart = { labels, datasets: [{ label: "Matched", data: matched, backgroundColor: "#2563eb", borderRadius: 7 }, { label: "Missing", data: missing, backgroundColor: "#f59e0b", borderRadius: 7 }] };
    return <section className="resume-card chart-card"><div className="card-title-row"><div><p className="card-kicker">Keyword analysis</p><h3>Role-specific language</h3></div><strong className="keyword-match">{value(analysis, "keyword_match", 0)}% match</strong></div>{keywords.length > 0 && <Bar data={chart} options={{ indexAxis: "y", responsive: true, plugins: { legend: { position: "bottom" } }, scales: { x: { max: 100, grid: { color: "#eef2f7" } }, y: { grid: { display: false } } } }} />}</section>;
}

export function ResumeSections({ analysis }) {
    const sections = list(analysis, "sections");
    return <section className="resume-card"><p className="card-kicker">Section analysis</p><h3>Make every section pull its weight</h3>{sections.length > 0 && <div className="section-donut"><Doughnut data={{ labels: sections.map((item) => item.name), datasets: [{ data: sections.map((item) => item.score), backgroundColor: ["#2563eb", "#4f46e5", "#10b981", "#f59e0b", "#38bdf8", "#fb7185", "#94a3b8"], borderWidth: 0 }] }} options={{ plugins: { legend: { position: "bottom", labels: { boxWidth: 9, usePointStyle: true } } }, cutout: "68%" }} /></div>}<div className="section-list">{sections.map((item) => <article key={item.name}><div><strong>{item.name}</strong><span>{item.strength || item.quality}</span></div><b>{item.score}%</b><p><em>Improve:</em> {item.recommendation || item.weakness}</p></article>)}</div></section>;
}

export function ResumeStrength({ analysis }) {
    const strengths = list(analysis, "resume_strength");
    return <section className="resume-card"><p className="card-kicker">Resume strength</p><h3>Your most persuasive signals</h3><div className="strength-list">{strengths.map((item) => <div key={item.name}><div><strong>{item.name}</strong><b>{item.score}%</b></div><div className="mini-progress"><span style={{ width: `${item.score}%` }} /></div><p>{item.recommendation}</p></div>)}</div></section>;
}

export function AISuggestions({ analysis }) { const suggestions = list(analysis, "suggestions"); return <section className="resume-card"><p className="card-kicker">AI suggestions</p><h3>Highest-impact improvements</h3><div className="suggestion-list">{suggestions.map((item, index) => <article key={item.id || index}><span className={`priority ${item.priority?.toLowerCase() || "medium"}`}>{item.priority || "Medium"} priority</span><h4>{item.title || item.reason}</h4><p>{item.example || item.description}</p><footer><strong>+{item.estimated_ats_increase || 0} ATS points</strong><button type="button">Apply suggestion <FaArrowUp /></button></footer></article>)}</div></section>; }

export function ResumeHistory({ history, onCompare }) { return <section className="resume-card"><div className="card-title-row"><div><p className="card-kicker">Version history</p><h3>Track your improvement</h3></div></div><div className="history-list">{history.map((item, index) => <article className="history-item" key={item.id || index}><div className="history-dot" /><div><strong>{item.version_name || `Version ${history.length - index}`}</strong>{index === 0 && <span className="latest-badge">Latest</span>}<p>{date(item.uploaded_at)} · ATS {item.ats_score ?? "—"}</p><small>{item.changes || item.file_name}</small></div>{index > 0 && <button type="button" className="text-btn" onClick={() => onCompare(item.id)}>Compare</button>}</article>)}</div></section>; }

export function ResumePreview() { const { resume } = useResume(); const [zoom, setZoom] = useState(100); const url = resume?.preview_url || resume?.file_url || resume?.download_url; return <section className="resume-card preview-card"><div className="card-title-row"><div><p className="card-kicker">Resume preview</p><h3>Review the submitted file</h3></div><div className="preview-tools"><button type="button" onClick={() => setZoom((x) => Math.min(x + 10, 150))}><FaSearchPlus /></button><button type="button" onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}><FaExpand /></button></div></div>{url ? <iframe title="Resume preview" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }} src={url} /> : <div className="preview-placeholder"><FaFileAlt /><p>Preview becomes available when the server returns a secure file URL.</p></div>}</section>; }

export function TrendChart({ history }) { const items = [...history].reverse(); if (!items.length) return null; return <section className="resume-card chart-card"><p className="card-kicker">ATS trend</p><h3>How your score is moving</h3><Line data={{ labels: items.map((item) => date(item.uploaded_at)), datasets: [{ label: "ATS score", data: items.map((item) => item.ats_score), borderColor: "#2563eb", backgroundColor: "rgba(37,99,235,.12)", fill: true, tension: .35 }] }} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 } } }} /></section>; }

export function CompareModal({ comparison, onClose }) { if (!comparison) return null; return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><div className="compare-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}>×</button><p className="card-kicker">Version comparison</p><h2>Your resume improved</h2><div className="compare-scores"><div><span>Previous ATS</span><strong>{comparison.previous_ats ?? "—"}</strong></div><FaArrowUp /><div><span>Current ATS</span><strong>{comparison.current_ats ?? "—"}</strong></div></div><div className="compare-list">{[["Added skills", comparison.added_skills, FaCheck], ["Removed skills", comparison.removed_skills, FaArrowDown], ["Improved sections", comparison.improved_sections, FaArrowUp]].map(([label, items, Icon]) => <div key={label}><Icon /><strong>{label}</strong><p>{Array.isArray(items) ? items.join(", ") || "None" : items || "None"}</p></div>)}</div></div></div>; }
