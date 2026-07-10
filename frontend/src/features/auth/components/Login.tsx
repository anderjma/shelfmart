// This file manages the authentication screen, controlling user access to the system.
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../lib/auth-context";
import BackButton from "../../../shared/components/BackButton";
import { getErrorMessage } from "../../../lib/http-error";

// This component captures and validates the entered credentials to issue the secure session token.
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await login(username, password);
            navigate("/");
        } catch (err) {
            setError(getErrorMessage(err, "Login failed. Please check your credentials."));
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden bg-ink-900">
            {/* Editorial background photo, muted so the glass card stays legible */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1615529162924-f8605388461d?q=80&w=2000&auto=format&fit=crop')" }}
                aria-hidden="true"
            />
            <div className="absolute inset-0 bg-ink-900/45" aria-hidden="true" />

            <div className="relative z-10 w-full max-w-md">
                <BackButton className="text-cream-100 hover:text-white" />
                <div className="bg-cream-100/85 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8 sm:p-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center text-ink-900 mb-1">Sign In</h1>
                    <p className="text-center text-sm text-ink-700 mb-8">
                        Don't have an account? <Link to="/register" className="text-navy-800 font-medium hover:underline">Register here</Link>
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="login-username" className="block text-sm font-medium text-ink-700 mb-1.5">Username</label>
                            <input
                                id="login-username"
                                type="text"
                                className="block w-full px-3.5 py-2.5 bg-cream-50/80 border border-sand-400 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-navy-700"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                className="block w-full px-3.5 py-2.5 bg-cream-50/80 border border-sand-400 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-navy-700"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-navy-800 hover:bg-navy-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-700 mt-2"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
