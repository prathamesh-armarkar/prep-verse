import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { PageHeader } from "../../components/Common/ReusableComponents";
import {
    AISuggestions,
    ATSGauge,
    KeywordAnalysis,
    MetricBreakdown,
    ResumeUpload,
    ResumeSections,
    ResumeStrength,
    SkillAnalysis,
} from "../../components/Resume/ResumeDashboard";
import {
    CategorizedSkills,
    ParsedResumeInformation,
    ProjectTable,
    ResumeAnalysisSummary,
    ResumeOverview,
    ResumeVersionHistory,
    RuleBasedSuggestions,
    SectionAnalysis,
} from "../../components/Resume/ResumeAnalysisPanel";
import { useResume } from "../../hooks/useResume";
import "./ResumeAnalyzer.css";

function LoadingDashboard() {
    return <div className="resume-skeleton" aria-label="Loading resume analysis"><div /><div /><div /><div /></div>;
}

function EmptyState() {
    return <section className="empty-resume-state"><div className="empty-icon">⌁</div><p className="card-kicker">Resume intelligence</p><h2>Upload your first resume</h2><p>Get a structured view of your experience, skills, and completed resume sections.</p><a className="primary-btn" href="#resume-upload">Upload resume</a></section>;
}

function ResumeAnalyzer() {
    const { resume, analysis, history, loading, error, aiWarning, parsingWarning, load } = useResume();
    const parsed = resume?.parsed_data || {};
    // Show AI-powered cards when the backend returned them (either from Groq or
    // from the deterministic backfill safety net).
    const hasAI = Boolean(
        analysis?.ats_score != null ||
        analysis?.ats_breakdown?.length ||
        analysis?.sections?.length ||
        analysis?.suggestions?.length,
    );

    return <DashboardLayout><div className="resume-analyzer-page">
        <PageHeader eyebrow="Resume Analyzer" title="Resume Intelligence dashboard" subtitle="Upload a version to review its parsed information, ATS compatibility, and AI-powered suggestions." />
        <div id="resume-upload"><ResumeUpload /></div>
        {loading ? <LoadingDashboard /> : !resume ? <EmptyState /> : <>
            {error && <div className="resume-alert page-alert"><span>{error}</span><button type="button" onClick={load}>Retry</button></div>}
            {aiWarning && <div className="resume-alert page-alert" style={{ background: "#fffbeb", borderColor: "#fde68a", color: "#92400e" }}><span>⚠ {aiWarning}</span></div>}
            {parsingWarning && <div className="resume-alert page-alert" style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#991b1b" }}><span>{parsingWarning}</span></div>}
            <ResumeOverview resume={resume} analysis={analysis} />
            <ResumeAnalysisSummary analysis={analysis} />

            {hasAI ? <>
                <section className="resume-grid overview-layout">
                    <ATSGauge score={analysis?.ats_score ?? 0} confidence={analysis?.confidence} />
                    <MetricBreakdown analysis={analysis} />
                </section>
                <section className="resume-grid two-column"><SkillAnalysis analysis={analysis} /><KeywordAnalysis analysis={analysis} /></section>
                <section className="resume-grid two-column"><ResumeSections analysis={analysis} /><ResumeStrength analysis={analysis} /></section>
                <AISuggestions analysis={analysis} />
            </> : null}

            <section className="resume-grid two-column"><SectionAnalysis analysis={analysis} /><CategorizedSkills parsed={parsed} analysis={analysis} /></section>
            <ProjectTable analysis={analysis} />
            <ParsedResumeInformation parsed={parsed} />
            <RuleBasedSuggestions analysis={analysis} />
            <section className="resume-grid two-column"><ResumeVersionHistory history={history} /></section>
        </>}
    </div></DashboardLayout>;
}

export default ResumeAnalyzer;

