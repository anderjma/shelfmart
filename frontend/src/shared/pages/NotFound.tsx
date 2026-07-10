// This file displays a friendly page when the user navigates to a nonexistent route.
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <SEO title="Page Not Found" description="The requested page does not exist." />
            <h1 className="text-7xl font-extrabold text-sand-300 select-none">404</h1>
            <h2 className="text-xl font-bold text-ink-900 mt-4">Page Not Found</h2>
            <p className="text-ink-700 mt-2 max-w-md">
                The page you are looking for does not exist or has been moved to another location.
            </p>
            <Link
                to="/"
                className="mt-6 inline-block bg-accent-500 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-accent-600 transition-colors shadow-sm"
            >
                Back to Home
            </Link>
        </div>
    );
}
