const asList = (value) => Array.isArray(value) ? value : [];
const title = (value) => String(value || "").replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const softSkills = new Set(["communication", "leadership", "teamwork", "team player", "problem solving", "problem-solving", "adaptability", "time management", "critical thinking", "collaboration", "creativity", "presentation", "management"]);
const formatDate = (input) => input ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(input)) : "—";

function Card({ eyebrow, title: heading, children, className = "" }) {
    return <section className={`resume-card analysis-card ${className}`}><p className="card-kicker">{eyebrow}</p><h3>{heading}</h3>{children}</section>;
}

// ---------------------------------------------------------------------------
// 1. Resume Overview
// ---------------------------------------------------------------------------
export function ResumeOverview({ resume, analysis }) {
    const overview = analysis?.overview || {};
    const parsed = resume?.parsed_data || {};
    const items = [
        ["Name", overview.name || parsed.name],
        ["Highest Education", overview.highest_education],
        ["Experience", overview.experience],
        ["Projects", overview.project_count != null ? `${overview.project_count}` : null],
        ["Technical Skills", overview.technical_skill_count != null ? `${overview.technical_skill_count}+` : null],
        ["Certifications", overview.certification_count != null ? `${overview.certification_count}` : null],
        ["Last Uploaded", formatDate(resume?.uploaded_at)],
    ];
    return <section className="resume-card overview-card"><div className="card-title-row"><div><p className="card-kicker">Resume overview</p><h3>{overview.name || parsed.name || "Candidate resume"}</h3></div><span className="status-pill">Analyzed</span></div><div className="overview-grid">{items.map(([label, content]) => <div key={label}><span>{label}</span><strong>{content || "—"}</strong></div>)}</div></section>;
}

// ---------------------------------------------------------------------------
// 2. Resume Intelligence summary cards
// ---------------------------------------------------------------------------
export function ResumeAnalysisSummary({ analysis }) {
    const skills = analysis?.skills_analysis || {};
    const projects = analysis?.project_analysis || {};
    const experience = analysis?.experience_analysis || {};
    const education = analysis?.education_analysis || {};
    const certifications = analysis?.certification_analysis || {};
    const contact = analysis?.contact_analysis || {};
    const completion = analysis?.resume_completeness?.overall_completion ?? 0;
    const items = [
        ["Resume Completeness", `${completion}%`, "overall"],
        ["Contact Information", contact.score != null ? `${contact.score}%` : "—", "contact"],
        ["Projects", projects.project_count || 0, "projects"],
        ["Technical Skills", skills.technical_skills || 0, "skills"],
        ["Experience", experience.experience_count || 0, "experience"],
        ["Education", education.education_count || 0, "education"],
        ["Certifications", certifications.certification_count || 0, "certifications"],
    ];
    return <Card eyebrow="Resume intelligence" title="What we found in your resume" className="intelligence-card"><div className="intelligence-grid">{items.map(([label, value, type]) => <div className={`intel-item ${type}`} key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="completion-highlight"><div><span>Resume completeness</span><strong>{completion}%</strong></div><div className="completion-bar"><span style={{ width: `${completion}%` }} /></div></div></Card>;
}

// ---------------------------------------------------------------------------
// 3. Parsed resume information
// ---------------------------------------------------------------------------
export function ParsedResumeInformation({ parsed }) {
    const contact = [["Name", parsed?.name], ["Email", parsed?.email], ["Phone", parsed?.phone], ["LinkedIn", parsed?.linkedin], ["GitHub", parsed?.github]];
    const groups = [["Skills", parsed?.skills], ["Education", parsed?.education], ["Experience", parsed?.experience], ["Projects", parsed?.projects]];
    return <Card eyebrow="Parsed resume" title="Information extracted from your file"><div className="parsed-contact">{contact.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value || "Not found"}</strong></div>)}</div><div className="parsed-groups">{groups.map(([label, values]) => <div key={label}><h4>{label}</h4>{asList(values).length ? <ul>{asList(values).map((value, index) => <li key={`${label}-${index}`}>{value}</li>)}</ul> : <p>Not found</p>}</div>)}</div></Card>;
}

// ---------------------------------------------------------------------------
// 4. Pre-ATS section analysis (checks)
// ---------------------------------------------------------------------------
export function SectionAnalysis({ analysis }) {
    const contact = analysis?.contact_analysis || {};
    const projects = analysis?.project_analysis || {};
    const experience = analysis?.experience_analysis || {};
    const education = analysis?.education_analysis || {};
    const skills = analysis?.skills_analysis || {};
    const certifications = analysis?.certification_analysis || {};

    const rows = [
        ["Email", contact.email ? "✔" : "⚠", contact.email ? "Complete" : "Missing", contact.email ? 100 : 0],
        ["Phone", contact.phone ? "✔" : "⚠", contact.phone ? "Complete" : "Missing", contact.phone ? 100 : 0],
        ["LinkedIn", contact.linkedin ? "✔" : "⚠", contact.linkedin ? "Complete" : "Add LinkedIn", contact.linkedin ? 100 : 0],
        ["GitHub", contact.github ? "✔" : "⚠", contact.github ? "Complete" : "GitHub missing", contact.github ? 100 : 0],
        ["Portfolio", contact.portfolio ? "✔" : "⚠", contact.portfolio ? "Complete" : "Portfolio missing", contact.portfolio ? 100 : 0],
    ];
    const projectCheck = projects.project_count ? "✔" : "⚠";
    const projectLabel = projects.project_count ? `${projects.project_count} Projects` : "Projects missing";
    const educationCheck = education.education_count ? "✔" : "⚠";
    const educationLabel = education.highest_degree ? education.highest_degree : "Education missing";
    const experienceCheck = experience.experience_count ? "✔" : "⚠";
    const experienceLabel = experience.experience_count ? "Experience detected" : "Experience missing";
    const skillsCheck = skills.total_skills ? "✔" : "⚠";
    const skillsLabel = skills.total_skills ? `${skills.total_skills} Skills` : "Skills missing";
    const certificationsCheck = certifications.certification_count ? "✔" : "⚠";
    const certificationsLabel = certifications.certification_count ? `${certifications.certification_count} Certifications` : "Certifications missing";

    return <Card eyebrow="Resume analysis" title="Section completeness (pre-ATS)"><div className="analysis-status-list"><div className="analysis-status-group"><h4>Contact</h4>{rows.map(([name, icon, status, score]) => <div key={name}><div><strong>{name}</strong><span className={score >= 100 ? "complete" : "needs-work"}>{icon} {status}</span></div><div className="completion-bar"><span style={{ width: `${score}%` }} /></div></div>)}</div><div className="analysis-status-group"><h4>Sections</h4>{[[projectCheck, projectLabel, projectCheck === "✔" ? 100 : 0], [educationCheck, educationLabel, educationCheck === "✔" ? 100 : 0], [experienceCheck, experienceLabel, experienceCheck === "✔" ? 100 : 0], [skillsCheck, skillsLabel, skillsCheck === "✔" ? 100 : 0], [certificationsCheck, certificationsLabel, certificationsCheck === "✔" ? 100 : 0]].map(([icon, label, score]) => <div key={label}><div><strong>{label}</strong><span className={score >= 100 ? "complete" : "needs-work"}>{icon}</span></div><div className="completion-bar"><span style={{ width: `${score}%` }} /></div></div>)}</div></div></Card>;
}

// ---------------------------------------------------------------------------
// 5. Categorized skills
// ---------------------------------------------------------------------------
export function CategorizedSkills({ parsed, analysis }) {
    const categories = analysis?.skills_analysis?.categories || {};
    const entries = Object.entries(categories);
    if (!entries.length) {
        return <Card eyebrow="Skills" title="Your skill breakdown"><p className="muted-text">No technical skills detected yet.</p></Card>;
    }
    return <Card eyebrow="Skills" title="Categorized technical skills"><div className="analysis-skill-groups">{entries.map(([category, skills]) => <div key={category}><h4>{category} <span>{skills.length}</span></h4><div>{skills.map((skill) => <span className="analysis-chip" key={skill}>{skill}</span>)}</div></div>)}</div></Card>;
}

// ---------------------------------------------------------------------------
// 6. Project table
// ---------------------------------------------------------------------------
export function ProjectTable({ analysis }) {
    const summaries = analysis?.project_analysis?.project_summaries || [];
    return <Card eyebrow="Projects" title="Project summary"><div className="project-table-wrap"><table className="project-table"><thead><tr><th>Project</th><th>Tech Stack</th><th>Status</th></tr></thead><tbody>{summaries.length ? summaries.map((project) => <tr key={project.name}><td><strong>{project.name}</strong>{project.description ? <small>{project.description}</small> : null}</td><td>{asList(project.tech_stack).join(", ") || "—"}</td><td><span className={`project-status ${(project.status || "").toLowerCase().replace(/\s+/g, "-")}`}>{project.status === "Strong" ? "✅ " : ""}{project.status || "—"}</span></td></tr>) : <tr><td colSpan="3">No projects detected.</td></tr>}</tbody></table></div></Card>;
}

// ---------------------------------------------------------------------------
// Rule-based suggestions (unchanged behaviour)
// ---------------------------------------------------------------------------
export function RuleBasedSuggestions({ analysis }) {
    const contact = analysis?.contact_analysis || {};
    const suggestions = [];
    if (!contact.linkedin) suggestions.push("Add a LinkedIn profile.");
    if (!contact.github) suggestions.push("Add a GitHub profile or portfolio link.");
    if ((analysis?.project_analysis?.project_count || 0) < 2) suggestions.push("Add one more technical project with its technologies and outcome.");
    if (!(analysis?.certification_analysis?.certification_count || 0)) suggestions.push("Include relevant certifications.");
    if (!(analysis?.experience_analysis?.experience_count || 0)) suggestions.push("Add experience details and quantified achievements where available.");
    return <Card eyebrow="Next steps" title="Rule-based improvements"><ul className="rule-suggestions">{suggestions.length ? suggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>) : <li>Your resume covers the core sections. Keep adding measurable outcomes.</li>}</ul></Card>;
}

// ---------------------------------------------------------------------------
// ATS coming soon placeholder
// ---------------------------------------------------------------------------
export function AtsComingSoon() {
    return <section className="resume-card ats-coming-soon"><p className="card-kicker">Coming soon</p><h3>ATS scoring &amp; AI suggestions</h3><p>Resume analysis complete. ATS scoring will be available after the Analysis Engine is enabled.</p><div className="coming-soon-pills"><span>ATS Score</span><span>Keyword Match</span><span>AI Suggestions</span></div></section>;
}

// ---------------------------------------------------------------------------
// Version history (V1, V2, V3 naming)
// ---------------------------------------------------------------------------
export function ResumeVersionHistory({ history }) {
    return <Card eyebrow="Version history" title="Every upload becomes a version"><div className="analysis-history">{history.length ? history.map((item, index) => <div key={item.id}><span>{`Resume V${history.length - index}`}</span><strong>{item.file_name}</strong><small>{formatDate(item.uploaded_at)}</small>{index === 0 ? <em className="latest-flag">Latest</em> : null}</div>) : <p>No uploaded versions yet.</p>}</div></Card>;
}

