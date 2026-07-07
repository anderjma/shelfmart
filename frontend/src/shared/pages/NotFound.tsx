// This file displays a friendly page when the user navigates to a nonexistent route.
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <SEO title="Page Not Found" description="The requested page does not exist." />
            <h1 className="text-7xl font-extrabold text-gray-200 select-none">404</h1>
            <h2 className="text-xl font-bold text-gray-900 mt-4">Page Not Found</h2>
            <p className="text-gray-500 mt-2 max-w-md">
                The page you are looking for does not exist or has been moved to another location.
            </p>
            <Link
                to="/"
                className="mt-6 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
                Back to Home
            </Link>
        </div>
    );
}
