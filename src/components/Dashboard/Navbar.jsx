import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBell, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/logo/logo.svg";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";

const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/assistant", label: "AI Career Assistant" },
    { to: "/resume-analyzer", label: "Resume Analyzer" },
    { to: "/skill-roadmap", label: "Skill Roadmap" }
];

function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setProfileOpen(false);
        setMobileOpen(false);
        navigate("/");
    };

    return (
        <header className="dashboard-navbar">
            <div className="dashboard-nav-shell">
                <Link to="/dashboard" className="dashboard-brand">
                    <img src={logo} alt="PrepVerse AI" className="dashboard-brand-logo" />
                </Link>

                <button
                    type="button"
                    className="nav-mobile-toggle"
                    onClick={() => setMobileOpen((previous) => !previous)}
                >
                    {mobileOpen ? <FaTimes /> : <FaBars />}
                </button>

                <nav className={`dashboard-nav-links ${mobileOpen ? "open" : ""}`}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `dashboard-nav-link${isActive ? " active" : ""}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="dashboard-nav-actions">
                    <button type="button" className="nav-icon-btn">
                        <FaBell />
                    </button>
                    <button type="button" className="nav-icon-btn theme-toggle">
                        <FaMoon />
                    </button>

                    <div className="profile-menu-wrapper">
                        <button
                            type="button"
                            className="profile-avatar-btn"
                            onClick={() => setProfileOpen((previous) => !previous)}
                        >
                            P
                        </button>

                        {profileOpen && (
                            <div className="profile-dropdown">
                                <Link to="/profile" onClick={() => setProfileOpen(false)}>My Profile</Link>
                                <button type="button" onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
