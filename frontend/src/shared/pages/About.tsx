// This file presents the company's history and value proposition.
import React from "react";
import SEO from "../components/SEO";

// This component serves as the institutional page to showcase the mission, vision, and corporate details.
export default function About() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            <SEO title="About Us" description="Learn about the history, mission, and vision behind ShelfMart, a commercial management platform." />
            <div className="text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">About Us</h1>
                <p className="text-lg sm:text-xl text-gray-500">Get to know the story behind ShelfMart</p>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1600&auto=format&fit=crop" alt="Team" className="w-full h-full object-cover" />
                </div>
                <div className="p-5 sm:p-8 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Our History</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We were born out of the need to offer high-quality products accessible to everyone. What started as a small university project has now grown into a complete platform that seeks to connect the best brands with our customers nationwide.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
                            <p className="text-gray-600">To provide a fast, secure, and intuitive shopping experience, always ensuring the best product catalog for our community.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h3>
                            <p className="text-gray-600">To become the country's leading online store, standing out for our technological innovation and impeccable customer service.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
