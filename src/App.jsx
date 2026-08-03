import { AuthProvider } from "./context/AuthContext";
import { ResumeProvider } from "./context/ResumeContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
    return (
        <AuthProvider>
            <ResumeProvider><AppRoutes /></ResumeProvider>
        </AuthProvider>
    );
}

export default App;
