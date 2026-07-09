// This file provides a consistent "go back" affordance reused across every page.
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Routes with no meaningful "back" target (top-level landing pages).
const HIDDEN_ON = ["/"];

export default function BackButton() {
    const navigate = useNavigate();
    const location = useLocation();

    if (HIDDEN_ON.includes(location.pathname)) return null;

    const handleBack = () => {
        // If we arrived via in-app navigation there's history to pop; otherwise (e.g. a
        // deep link opened directly) fall back to a known safe route instead of leaving the app.
        if (window.history.state?.idx > 0) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    return (
        <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1 py-1 mb-4"
        >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back
        </button>
    );
}
