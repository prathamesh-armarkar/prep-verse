import { FaBell, FaChevronRight, FaCloudUploadAlt, FaPaperPlane, FaSearch, FaUserCircle } from "react-icons/fa";
import "./ReusableComponents.css";

export function PageHeader({ title, subtitle, action, eyebrow }) {
    return (
        <div className="page-header">
            <div>
                {eyebrow ? <span className="page-eyebrow">{eyebrow}</span> : null}
                <h1>{title}</h1>
                {subtitle ? <p>{subtitle}</p> : null}
            </div>
            {action ? <div className="page-header-action">{action}</div> : null}
        </div>
    );
}

export function StatsCard({ label, value, change, icon, accent = "blue" }) {
    return (
        <article className={`stats-card accent-${accent}`}>
            <div className="stats-card-icon">{icon}</div>
            <div>
                <p>{label}</p>
                <h3>{value}</h3>
                <span>{change}</span>
            </div>
        </article>
    );
}

export function ActionCard({ title, description, icon, actionLabel = "Open" }) {
    return (
        <article className="action-card">
            <div className="action-card-icon">{icon}</div>
            <div>
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
            <button type="button">{actionLabel}</button>
        </article>
    );
}

export function ProgressCard({ title, percent, detail }) {
    return (
        <article className="progress-card">
            <div className="progress-card-top">
                <h4>{title}</h4>
                <span>{percent}%</span>
            </div>
            <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
            </div>
            <p>{detail}</p>
        </article>
    );
}

export function Timeline({ items }) {
    return (
        <div className="timeline-card">
            {items.map((item, index) => (
                <div key={`${item.title}-${index}`} className="timeline-item">
                    <div className="timeline-dot" />
                    <div>
                        <h4>{item.title}</h4>
                        <p>{item.date}</p>
                        <span>{item.status}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function EmptyState({ title, description, actionLabel = "Try again" }) {
    return (
        <div className="empty-state">
            <FaCloudUploadAlt />
            <h3>{title}</h3>
            <p>{description}</p>
            <button type="button">{actionLabel}</button>
        </div>
    );
}

export function LoadingSkeleton({ lines = 3 }) {
    return (
        <div className="loading-skeleton">
            <div className="skeleton-line wide" />
            {Array.from({ length: lines }).map((_, index) => (
                <div key={index} className={`skeleton-line${index === lines - 1 ? " short" : ""}`} />
            ))}
        </div>
    );
}

export function SearchBar({ placeholder = "Search", value, onChange }) {
    return (
        <label className="search-bar">
            <FaSearch />
            <input value={value} onChange={onChange} placeholder={placeholder} />
        </label>
    );
}

export function NotificationBell({ count = 3 }) {
    return (
        <button type="button" className="notification-bell">
            <FaBell />
            <span>{count}</span>
        </button>
    );
}

export function ProfileDropdown() {
    return (
        <div className="profile-dropdown-card">
            <div className="profile-dropdown-header">
                <FaUserCircle />
                <div>
                    <strong>Priya Shah</strong>
                    <p>Student • Java Full Stack</p>
                </div>
            </div>
            <button type="button">View Profile</button>
            <button type="button">Preferences</button>
        </div>
    );
}

export function UploadZone({ title, subtitle }) {
    return (
        <label className="upload-zone">
            <FaCloudUploadAlt />
            <strong>{title}</strong>
            <p>{subtitle}</p>
            <input type="file" hidden />
        </label>
    );
}

export function ChatBubble({ role, content, meta }) {
    return (
        <div className={`chat-bubble ${role}`}>
            <div className="chat-bubble-content">
                <p>{content}</p>
            </div>
            {meta ? <span>{meta}</span> : null}
        </div>
    );
}

export function PromptChip({ label, active = false }) {
    return (
        <button type="button" className={`prompt-chip${active ? " active" : ""}`}>
            <FaSearch />
            <span>{label}</span>
        </button>
    );
}

export function ChartCard({ title, subtitle, children }) {
    return (
        <article className="chart-card">
            <div className="chart-card-header">
                <div>
                    <h4>{title}</h4>
                    {subtitle ? <p>{subtitle}</p> : null}
                </div>
                <FaChevronRight />
            </div>
            <div className="chart-card-body">{children}</div>
        </article>
    );
}
