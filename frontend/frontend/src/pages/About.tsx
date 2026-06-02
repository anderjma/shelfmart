import React from "react";

export default function About() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">Sobre Nosotros</h1>
                <p className="text-xl text-gray-500">Conociendo la historia detrás de Inventario Pyme.</p>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1600&auto=format&fit=crop" alt="Equipo" className="w-full h-full object-cover" />
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Nuestra Historia</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Nacimos de la necesidad de ofrecer productos de alta calidad accesibles para todos. Lo que comenzó como un pequeño proyecto universitario hoy se transforma en una plataforma completa que busca conectar las mejores marcas con nuestros clientes a nivel nacional.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Nuestra Misión</h3>
                            <p className="text-gray-600">Proveer una experiencia de compra rápida, segura e intuitiva, asegurando siempre el mejor catálogo de productos para nuestra comunidad.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Nuestra Visión</h3>
                            <p className="text-gray-600">Convertirnos en la tienda en línea líder del país, destacando por nuestra innovación tecnológica y un servicio al cliente impecable.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
