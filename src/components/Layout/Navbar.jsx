import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

import logo from "../../assets/logo/logo.svg";

function Navbar({ openAuth }) {

    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState("home");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {

        const handleScroll = () => {

            setScrolled(window.scrollY > 30);

            const sections = [
                "home",
                "features",
                "how",
                "why",
                "testimonials"
            ];

            sections.forEach((id) => {

                const section = document.getElementById(id);

                if (!section) return;

                const top = section.offsetTop - 150;
                const bottom = top + section.offsetHeight;

                if (
                    window.scrollY >= top &&
                    window.scrollY < bottom
                ) {
                    setActive(id);
                }

            });

        };

        const handleResize = () => {
            if (window.innerWidth > 768) setMenuOpen(false);
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };

    }, []);

    const scrollToSection = (id) => {

        const section = document.getElementById(id);

        // Close the mobile menu before navigating
        setMenuOpen(false);

        if (!section) return;

        const navbarHeight = 110;

        const position =
            section.getBoundingClientRect().top +
            window.pageYOffset -
            navbarHeight;

        window.scrollTo({
            top: position,
            behavior: "smooth",
        });

        setActive(id);

    };

    const handleAuth = (mode) => {
        setMenuOpen(false);
        openAuth(mode);
    };

    return (

        <nav className={`custom-navbar ${scrolled ? "scrolled" : ""}`}>

            <div className="container navbar-wrapper">

                {/* Logo */}

                <Link
                    to="/"
                    className="logo-box"
                    onClick={() => setMenuOpen(false)}
                >

                    <img
                        src={logo}
                        alt="PrepVerse AI"
                        className="logo"
                    />

                </Link>

                {/* Mobile Toggle */}

                <button
                    type="button"
                    className={`nav-toggle ${menuOpen ? "open" : ""}`}
                    onClick={() => setMenuOpen((previous) => !previous)}
                    aria-expanded={menuOpen}
                    aria-label="Toggle navigation menu"
                >
                    <span />
                    <span />
                    <span />
                </button>

                {/* Navigation */}

                <ul className={`menu ${menuOpen ? "open" : ""}`}>

                    <li>
                        <button
                            onClick={() => scrollToSection("home")}
                            className={active === "home" ? "active" : ""}
                        >
                            Home
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => scrollToSection("features")}
                            className={active === "features" ? "active" : ""}
                        >
                            Features
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => scrollToSection("how")}
                            className={active === "how" ? "active" : ""}
                        >
                            How It Works
                        </button>
                    </li>

                   

                </ul>

{/* Authentication Buttons */}

                <div className={`nav-actions ${menuOpen ? "open" : ""}`}>

                    <button
                        className="login-btn"
                        onClick={() => handleAuth("login")}
                    >
                        Login
                    </button>

                    <button
                        className="register-btn"
                        onClick={() => handleAuth("register")}
                    >
                        Register
                    </button>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;