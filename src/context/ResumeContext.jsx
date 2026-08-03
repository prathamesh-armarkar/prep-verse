import { createContext, useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { resumeService } from "../services/resumeService";

const ResumeContext = createContext(null);
const getMessage = (error) => error.response?.data?.message || error.message || "We could not load your resume data.";

export function ResumeProvider({ children }) {
    const { token, isAuthenticated } = useAuth();
    const [resume, setResume] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [history, setHistory] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const [aiWarning, setAiWarning] = useState("");
    const [parsingWarning, setParsingWarning] = useState("");

    const load = useCallback(async () => {
        if (!isAuthenticated || !token) { setLoading(false); return; }
        setLoading(true); setError(""); setAiWarning(""); setParsingWarning("");
        try {
            const [latest, versions] = await Promise.all([resumeService.getLatest(token), resumeService.getHistory(token)]);
            const item = latest?.resume ?? latest ?? null;
            setResume(item); setAnalysis(item?.analysis ?? latest?.analysis ?? null);
            setAiWarning(latest?.ai_warning || "");
            setParsingWarning(latest?.parsing_warning || "");
            setHistory(versions?.history ?? versions?.resumes ?? versions ?? []);
        } catch (requestError) {
            if (requestError.response?.status !== 404) setError(getMessage(requestError));
            setResume(null); setHistory([]);
        } finally { setLoading(false); }
    }, [isAuthenticated, token]);

    useEffect(() => { const id = setTimeout(load, 0); return () => clearTimeout(id); }, [load]);

    const upload = async (file, targetRole = "", jobDescription = "") => {
        setUploading(true); setProgress(0); setError(""); setAiWarning(""); setParsingWarning("");
        try {
            const result = await resumeService.upload(file, token, targetRole, jobDescription, (event) => {
                if (event.total) setProgress(Math.round((event.loaded * 100) / event.total));
            });
            const item = result?.resume ?? result;
            setResume(item); setAnalysis(item?.analysis ?? result?.analysis ?? null);
            setAiWarning(result?.ai_warning || "");
            setParsingWarning(result?.parsing_warning || "");
            await load();
            return item;
        } catch (requestError) { setError(getMessage(requestError)); throw requestError; }
        finally { setUploading(false); }
    };

    const deleteResume = async (id) => {
        await resumeService.remove(id, token); setResume(null); setAnalysis(null); await load();
    };

    const selectVersion = async (id) => {
        setSelectedVersion(id);
        const result = await resumeService.getById(id, token);
        const item = result?.resume ?? result;
        setResume(item); setAnalysis(item?.analysis ?? result?.analysis ?? null);
    };

return <ResumeContext.Provider value={{ resume, analysis, history, loading, uploading, progress, error, setError, aiWarning, parsingWarning, selectedVersion, load, upload, deleteResume, selectVersion, compare: (id) => resumeService.compare(id, token) }}>{children}</ResumeContext.Provider>;
}

export { ResumeContext };
