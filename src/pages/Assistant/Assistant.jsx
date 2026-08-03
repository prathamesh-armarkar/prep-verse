import { useCallback, useEffect, useRef, useState } from "react";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { PageHeader } from "../../components/Common/ReusableComponents";
import { FaPaperPlane, FaPlus, FaRegCopy, FaRedo, FaRobot, FaTrash, FaVolumeUp } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { assistantService } from "../../services/assistantService";
import "./Assistant.css";

const PROMPT_SUGGESTIONS = [
    "Improve my resume for ATS",
    "How do I prepare for technical interviews?",
    "Generate a Java Full Stack roadmap",
    "What skills should I learn for data science?",
    "Help me write a cover letter",
    "Analyze my resume strengths and weaknesses",
];

function Assistant() {
    const { user, token } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [historyList, setHistoryList] = useState([]);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    // Load chat history on mount
    const loadHistory = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const history = await assistantService.getHistory(token, 50);
            setHistoryList(history);
            // Group by session: consecutive user-assistant pairs
            setMessages(history);
        } catch {
            // Chat history unavailable is not critical
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { loadHistory(); }, [loadHistory]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = useCallback(async (text) => {
        if (!text.trim() || sending || !token) return;
        setSending(true);
        setError("");

        // Optimistic update: add user message immediately
        const userMsg = { role: "user", message: text, id: `temp-${Date.now()}` };
        setMessages((prev) => [...prev, userMsg]);

        try {
            const result = await assistantService.send(text, token);
            const assistantMsg = {
                role: "assistant",
                message: result.message,
                actions: result.actions || [],
                id: `resp-${Date.now()}`,
            };
            setMessages((prev) => [...prev, assistantMsg]);
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || "Failed to get response. Please try again.";
            setError(errMsg);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", message: `⚠️ ${errMsg}`, id: `err-${Date.now()}` },
            ]);
        } finally {
            setSending(false);
        }
    }, [sending, token]);

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handlePromptClick = (prompt) => {
        setInput(prompt);
        inputRef.current?.focus();
    };

    const handleNewChat = () => {
        setMessages([]);
        setError("");
        setInput("");
        inputRef.current?.focus();
    };

    const handleClearHistory = async () => {
        if (!token) return;
        try {
            await assistantService.clearHistory(token);
            setMessages([]);
            setHistoryList([]);
            setError("");
        } catch {
            setError("Failed to clear history.");
        }
    };

    const handleCopyMessage = (text) => {
        navigator.clipboard?.writeText(text);
    };

    // Show only the last 5 messages in the sidebar as recent chat previews
    const recentChats = messages
        .filter((m) => m.role === "user")
        .slice(-5)
        .reverse();

    return (
        <DashboardLayout>
            <div className="assistant-page">
                <PageHeader
                    eyebrow="AI Career Assistant"
                    title="Your always-on mentor for interviews, resumes, and strategy"
                    subtitle="Ask anything about resumes, interviews, career planning, or skill growth."
                    action={
                        <button type="button" className="assistant-action-btn" onClick={handleNewChat}>
                            <FaPlus /> New Chat
                        </button>
                    }
                />

                <div className="assistant-shell">
                    <aside className="assistant-sidebar">
                        <h3>Recent questions</h3>
                        <div className="assistant-history-list">
                            {recentChats.length > 0 ? (
                                recentChats.map((msg, i) => (
                                    <div
                                        key={msg.id || i}
                                        className="assistant-history-item"
                                        onClick={() => setInput(msg.message)}
                                    >
                                        <strong>You</strong>
                                        <span>{msg.message.slice(0, 60)}{msg.message.length > 60 ? "..." : ""}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="assistant-empty-history">No messages yet. Start a conversation!</p>
                            )}
                        </div>
                        {messages.length > 0 && (
                            <button
                                type="button"
                                className="assistant-clear-btn"
                                onClick={handleClearHistory}
                            >
                                <FaTrash /> Clear history
                            </button>
                        )}
                    </aside>

                    <section className="assistant-main">
                        {error && (
                            <div className="assistant-alert">{error}</div>
                        )}

                        {messages.length === 0 && !loading && (
                            <div className="assistant-hero-card">
                                <h2>Let PrepVerse AI guide your next step</h2>
                                <p>
                                    Ask anything about resumes, interviews, career planning, or skill growth.
                                    Your chat history is saved so you can continue anytime.
                                </p>
                            </div>
                        )}

                        <div className="assistant-prompt-list">
                            {PROMPT_SUGGESTIONS.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    className="prompt-chip"
                                    onClick={() => handlePromptClick(prompt)}
                                >
                                    <FaRobot />
                                    <span>{prompt}</span>
                                </button>
                            ))}
                        </div>

                        <div className="assistant-chat-panel">
                            {loading && messages.length === 0 ? (
                                <div className="assistant-loading">
                                    <div className="loader-spinner" />
                                    <p>Loading your conversation history...</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="assistant-empty-state">
                                    <FaRobot size={40} />
                                    <p>Send a message to start the conversation.</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <div key={msg.id || i} className={`chat-bubble ${msg.role}`}>
                                        <div className="chat-bubble-content">
                                            <p>{msg.message}</p>
                                        </div>
                                        <div className="chat-bubble-footer">
                                            <span className="chat-bubble-meta">
                                                {msg.role === "user" ? "You" : "PrepVerse AI"}
                                                {" · "}
                                                {msg.created_at
                                                    ? new Date(msg.created_at).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : "just now"}
                                            </span>
                                            {msg.role === "assistant" && (
                                                <button
                                                    type="button"
                                                    className="chat-copy-btn"
                                                    onClick={() => handleCopyMessage(msg.message)}
                                                    title="Copy response"
                                                >
                                                    <FaRegCopy />
                                                </button>
                                            )}
                                        </div>
                                        {msg.actions?.length > 0 && (
                                            <div className="chat-suggestions">
                                                {msg.actions.map((action, ai) => (
                                                    <button
                                                        key={ai}
                                                        type="button"
                                                        className="chat-suggestion-chip"
                                                        onClick={() => sendMessage(action)}
                                                        disabled={sending}
                                                    >
                                                        {action}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                            {sending && (
                                <div className="chat-bubble assistant">
                                    <div className="chat-bubble-content">
                                        <div className="typing-indicator">
                                            <span /><span /><span />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="assistant-input-card">
                            <div className="assistant-input-box">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Ask PrepVerse AI anything..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={sending}
                                />
                                <div className="assistant-input-actions">
                                    <button
                                        type="button"
                                        className="assistant-icon-btn"
                                        onClick={() => {
                                            if (messages.length > 0) {
                                                const lastAssistant = [...messages].reverse().find(m => m.role === "assistant");
                                                if (lastAssistant) handleCopyMessage(lastAssistant.message);
                                            }
                                        }}
                                        title="Copy last response"
                                    >
                                        <FaRegCopy />
                                    </button>
                                    <button
                                        type="button"
                                        className={`assistant-send-btn ${sending ? "disabled" : ""}`}
                                        onClick={handleSend}
                                        disabled={sending || !input.trim()}
                                    >
                                        <FaPaperPlane />
                                    </button>
                                </div>
                            </div>

                            <div className="assistant-toolbar">
                                <button
                                    type="button"
                                    className="assistant-toolbar-btn"
                                    onClick={handleNewChat}
                                >
                                    <FaPlus /> New Chat
                                </button>
                                <button
                                    type="button"
                                    className="assistant-toolbar-btn"
                                    onClick={handleClearHistory}
                                >
                                    <FaTrash /> Clear
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Assistant;

