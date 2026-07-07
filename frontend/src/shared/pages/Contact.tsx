// This file presents the business's contact information and social media links.
import React from "react";
import { Phone, Mail } from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok } from "react-icons/si";
import SEO from "../components/SEO";

// This component renders a static interface with the support channels available to customers.
export default function Contact() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <SEO title="Contact" description="Contact us through our official channels. We are ready to assist you." />
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-5 sm:p-8">
                <p className="text-gray-600 text-center mb-10 text-lg">
                    Have a question or inquiry? We're here to help you through any of our official channels.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Customer Service</h2>
                        <div className="flex items-center text-gray-700">
                            <Phone className="w-6 h-6 text-blue-600 mr-4" />
                            <div>
                                <p className="font-medium">Phone</p>
                                <a href="tel:+50688888888" className="text-blue-600 hover:underline">+506 8888-8888</a>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Mail className="w-6 h-6 text-blue-600 mr-4" />
                            <div>
                                <p className="font-medium">Email</p>
                                <a href="mailto:info@shelfmart.com" className="text-blue-600 hover:underline">info@shelftmart.com</a>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Our Social Media</h2>

                        <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                            <SiFacebook className="w-6 h-6 mr-4" />
                            <span className="font-medium">Facebook</span>
                        </a>
                        
                        <a href="#" className="flex items-center text-gray-700 hover:text-pink-600 transition-colors">
                            <SiInstagram className="w-6 h-6 mr-4" />
                            <span className="font-medium">Instagram</span>
                        </a>
                        
                        <a href="#" className="flex items-center text-gray-700 hover:text-black transition-colors">
                            <SiTiktok className="w-6 h-6 mr-4" />
                            <span className="font-medium">TikTok</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
