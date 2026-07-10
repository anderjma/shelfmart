// This file provides the registration form for new customers on the platform.
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerCustomer } from "../api/authService";
import toast from "react-hot-toast";
import BackButton from "../../../shared/components/BackButton";
import { getErrorMessage } from "../../../lib/http-error";

// This component validates the registration fields and sends the initial credentials to the server.
export default function Register() {
    const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await registerCustomer(formData);
            toast.success("Account created successfully!");
            navigate("/login");
        } catch (err) {
            setError(getErrorMessage(err, "Error registering the account."));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-center text-ink-900 mb-1">Create Account</h1>
                    <p className="text-center text-sm text-ink-700 mb-8">
                        Join us to start shopping
                    </p>

                    {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm text-center" role="alert">{error}</div>}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="register-name" className="block text-sm font-medium text-ink-700 mb-1.5">Full Name</label>
                                <input id="register-name" name="name" type="text" required className="block w-full px-3.5 py-2.5 bg-cream-50/80 border border-sand-400 rounded-xl shadow-sm placeholder-ink-700/40 focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-navy-700 sm:text-sm" placeholder="John Smith" onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="register-email" className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
                                <input id="register-email" name="email" type="email" required className="block w-full px-3.5 py-2.5 bg-cream-50/80 border border-sand-400 rounded-xl shadow-sm placeholder-ink-700/40 focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-navy-700 sm:text-sm" placeholder="john@example.com" onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="register-username" className="block text-sm font-medium text-ink-700 mb-1.5">Username</label>
                                <input id="register-username" name="username" type="text" required className="block w-full px-3.5 py-2.5 bg-cream-50/80 border border-sand-400 rounded-xl shadow-sm placeholder-ink-700/40 focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-navy-700 sm:text-sm" placeholder="johnsmith123" onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="register-password" className="block text-sm font-medium text-ink-700 mb-1.5">Password</label>
                                <input id="register-password" name="password" type="password" required minLength={6} className="block w-full px-3.5 py-2.5 bg-cream-50/80 border border-sand-400 rounded-xl shadow-sm placeholder-ink-700/40 focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-navy-700 sm:text-sm" placeholder="Minimum 6 characters" onChange={handleChange} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-navy-800 hover:bg-navy-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-700 disabled:bg-navy-800/40">
                            {loading ? "Registering..." : "Register"}
                        </button>

                        <div className="text-sm text-center">
                            <Link to="/login" className="font-medium text-navy-800 hover:underline">
                                Already have an account? Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
