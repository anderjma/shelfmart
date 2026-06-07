import React from "react";
import { Phone, Mail } from "lucide-react";
import { SiFacebook, SiInstagram, SiTiktok } from "react-icons/si";

export default function Contact() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contáctanos</h1>
            
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8">
                <p className="text-gray-600 text-center mb-10 text-lg">
                    ¿Tienes alguna duda o consulta? Estamos aquí para ayudarte a través de cualquiera de nuestros canales oficiales.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Atención al Cliente</h2>
                        <div className="flex items-center text-gray-700">
                            <Phone className="w-6 h-6 text-blue-600 mr-4" />
                            <div>
                                <p className="font-medium">Teléfono / WhatsApp</p>
                                <a href="tel:+50688888888" className="text-blue-600 hover:underline">+506 8888-8888</a>
                            </div>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Mail className="w-6 h-6 text-blue-600 mr-4" />
                            <div>
                                <p className="font-medium">Correo Electrónico</p>
                                <a href="mailto:info@portalcomercial.com" className="text-blue-600 hover:underline">info@portalcomercial.com</a>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Nuestras Redes</h2>
                        
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
