import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

import logo from "../../assets/logo/logo.svg";

function Navbar({ openAuth }) {

    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState("home");

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

        window.addEventListener("scroll", handleScroll);

        return () =>
            window.removeEventListener("scroll", handleScroll);

    }, []);

    const scrollToSection = (id) => {

        const section = document.getElementById(id);

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

    return (

        <nav className={`custom-navbar ${scrolled ? "scrolled" : ""}`}>

            <div className="container navbar-wrapper">

                {/* Logo */}

                <Link
                    to="/"
                    className="logo-box"
                >

                    <img
                        src={logo}
                        alt="PrepVerse AI"
                        className="logo"
                    />

                </Link>

                {/* Navigation */}

                <ul className="menu">

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

                <div className="nav-actions">

                    <button
                        className="login-btn"
                        onClick={() => openAuth("login")}
                    >
                        Login
                    </button>

                    <button
                        className="register-btn"
                        onClick={() => openAuth("register")}
                    >
                        Register
                    </button>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;