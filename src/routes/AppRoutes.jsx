import { Routes, Route } from "react-router-dom";

// Public Page
import Home from "../pages/Home/Home";

// Protected Pages
import Dashboard from "../pages/Dashboard/Dashboard";
import Assistant from "../pages/Assistant/Assistant";
import ResumeAnalyzer from "../pages/Resume/ResumeAnalyzer";
import SkillRoadmap from "../pages/Roadmap/SkillRoadmap";
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";

// Route Guard
import ProtectedRoute from "../components/Common/ProtectedRoute";

// Error Page
import NotFound from "../pages/Error/NotFound";

function AppRoutes() {
    return (
        <Routes>

            {/* Landing Page (Public) */}
            <Route path="/" element={<Home />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/assistant" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />
            <Route path="/resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
            <Route path="/skill-roadmap" element={<ProtectedRoute><SkillRoadmap /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}

export default AppRoutes;
