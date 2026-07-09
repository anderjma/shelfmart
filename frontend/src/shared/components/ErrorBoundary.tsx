// This file catches render-time errors anywhere in the tree so a single broken page
// shows a recoverable fallback instead of a blank screen.
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Unhandled render error:", error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false });
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4" role="alert">
                    <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" aria-hidden="true" />
                    <h1 className="text-xl font-bold text-gray-900">Something went wrong</h1>
                    <p className="text-gray-500 mt-2 max-w-md">
                        An unexpected error occurred while displaying this page. You can try going back to the home page.
                    </p>
                    <button
                        onClick={this.handleReload}
                        className="mt-6 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Back to Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
