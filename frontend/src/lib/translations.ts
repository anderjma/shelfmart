export type TranslationKey = string;

export const translations: Record<"es" | "en", Record<string, string>> = {
    es: {
        // Navigation & Header
        "nav.catalog": "Catálogo",
        "nav.about": "Nosotros",
        "nav.contact": "Contacto",
        "nav.admin": "Admin",
        "nav.signIn": "Iniciar Sesión",
        "nav.createAccount": "Crear Cuenta",
        "nav.myProfile": "Mi Perfil",
        "nav.myCart": "Mi Carrito",
        "nav.logOut": "Cerrar Sesión",
        "nav.viewCart": "Ver carrito",
        "nav.openMenu": "Abrir menú principal",
        "nav.closeMenu": "Cerrar menú principal",

        // Common
        "common.back": "Volver",
        "common.save": "Guardar",
        "common.cancel": "Cancelar",
        "common.confirm": "Confirmar",
        "common.delete": "Eliminar",

        // Categories
        "cat.All": "Todos",
        "cat.Beauty": "Belleza",
        "cat.Books": "Libros",
        "cat.Clothing": "Ropa",
        "cat.Electronics": "Electrónica",
        "cat.Furniture": "Muebles",
        "cat.Groceries": "Comestibles",
        "cat.Home": "Hogar",
        "cat.Sports": "Deportes",

        // Store / Catalog
        "store.title": "Catálogo de Productos",
        "store.subtitle": "Explora nuestra selección y encuentra lo que necesitas.",
        "store.searchPlaceholder": "Buscar productos por nombre o categoría...",
        "store.searchLabel": "Buscar productos",
        "store.addToCart": "Añadir al Carrito",
        "store.soldOut": "Agotado",
        "store.onlyLeft": "¡Solo quedan {count}!",
        "store.new": "Nuevo",
        "store.featured": "Destacado",
        "store.noProducts": "No hay productos disponibles",
        "store.noProductsDesc": "Intenta seleccionar una categoría diferente.",
        "store.tryCategory": "Intenta seleccionar una categoría diferente.",
        "store.results": "resultados",
        "store.discountOff": "-{pct}% DCTO",
        "store.viewDetailsFor": "Ver detalles de {name}",
        "store.addToCartAria": "Añadir {name} al carrito",

        // Home
        "home.heroTitle": "¡Bienvenido a ShelfMart!",
        "home.heroSubtitle": "Piezas cuidadosamente seleccionadas para un hogar pensado, no decorado.",
        "home.exploreCatalog": "Explora nuestro catálogo",
        "home.featuredDeals": "Ofertas Destacadas",
        "home.newArrivals": "Novedades",
        "home.limitedStock": "Últimas Unidades",
        "home.lowStock": "Poco stock",
        "home.lowStockBadge": "Poco stock",

        // Product Detail
        "detail.home": "Inicio",
        "detail.catalog": "Catálogo",
        "detail.newArrival": "Novedad",
        "detail.inStock": "En Stock ({count} disponibles)",
        "detail.lowStock": "¡Poco Stock: Quedan solo {count}!",
        "detail.soldOut": "Agotado",
        "detail.outOfStock": "Actualmente fuera de stock",
        "detail.description": "Descripción",
        "detail.quantity": "Cantidad:",
        "detail.maxPerPurchase": "Máx {count} por compra",
        "detail.addToCart": "Añadir al Carrito",
        "detail.buyNow": "Comprar Ahora",
        "detail.adding": "Añadiendo...",
        "detail.processing": "Procesando...",
        "detail.delivery": "Envío rápido y seguro",
        "detail.genuine": "Producto 100% auténtico",
        "detail.returns": "Garantía de devolución de 30 días",
        "detail.moreIn": "Más en {category}",
        "detail.viewAll": "Ver todos",
        "detail.notFound": "Producto No Encontrado",
        "detail.notFoundDesc": "El artículo que buscas pudo haber sido movido o ya no está disponible en nuestro catálogo.",
        "detail.returnToCatalog": "Volver al Catálogo",

        // Product (used by ProductDetail.tsx)
        "product.notFound": "Producto No Encontrado",
        "product.notFoundDesc": "El artículo que buscas pudo haber sido movido o ya no está disponible en nuestro catálogo.",
        "product.returnToCatalog": "Volver al Catálogo",
        "product.newArrival": "Novedad",
        "product.noImage": "Sin imagen disponible",
        "product.save": "Ahorra {pct}%",
        "product.inStock": "En Stock ({count} unidades disponibles)",
        "product.lowStock": "¡Poco Stock: Quedan solo {count}!",
        "product.description": "Descripción",
        "product.quantity": "Cantidad:",
        "product.decreaseQuantity": "Disminuir cantidad",
        "product.increaseQuantity": "Aumentar cantidad",
        "product.maxPerPurchase": "Máx {count} por compra",
        "product.addToCart": "Añadir al Carrito",
        "product.buyNow": "Comprar Ahora",
        "product.adding": "Añadiendo...",
        "product.processing": "Procesando...",
        "product.outOfStock": "Actualmente fuera de stock",
        "product.fastDelivery": "Envío rápido y seguro",
        "product.genuine": "Producto 100% auténtico",
        "product.returnPolicy": "Política de devolución de 30 días",
        "product.moreIn": "Más en {category}",
        "product.viewAll": "Ver todos",
        "product.discountOff": "-{pct}% DCTO",
        "product.signInRequired": "Por favor inicia sesión para añadir artículos a tu carrito.",
        "product.adminRestriction": "Las cuentas de administrador no pueden realizar compras.",
        "product.addedToCartToast": "¡{quantity} {unit} de \"{name}\" añadida(s) al carrito!",
        "product.unit": "unidad",
        "product.units": "unidades",

        // Cart
        "cart.title": "Mi Carrito de Compras",
        "cart.myCart": "Mi Carrito de Compras",
        "cart.empty": "Tu carrito está vacío",
        "cart.backToCatalog": "Volver al catálogo",
        "cart.product": "Producto",
        "cart.unitPrice": "Precio Unitario",
        "cart.quantity": "Cantidad",
        "cart.subtotal": "Subtotal",
        "cart.actions": "Acciones",
        "cart.price": "Precio",
        "cart.total": "Total:",
        "cart.totalDue": "Total a pagar:",
        "cart.completePurchase": "Finalizar Compra",
        "cart.processing": "Procesando...",
        "cart.loading": "Cargando carrito...",
        "cart.removeItemTitle": "Eliminar Producto",
        "cart.removeItemConfirm": "¿Deseas eliminar este producto del carrito?",
        "cart.removeItemMsg": "¿Deseas eliminar este producto del carrito?",
        "cart.removeItem": "Eliminar",
        "cart.remove": "Eliminar",
        "cart.confirmPurchaseTitle": "Confirmar Compra",
        "cart.confirmPurchasePrompt": "¿Deseas confirmar tu compra? Esta acción no se puede deshacer.",
        "cart.confirmPurchaseMsg": "¿Deseas confirmar tu compra? Esta acción no se puede deshacer.",
        "cart.confirmPurchase": "Confirmar Compra",
        "cart.removedToast": "Producto eliminado del carrito",
        "cart.purchasedToast": "¡Compra procesada con éxito!",
        "cart.decreaseAria": "Disminuir cantidad de {name}",
        "cart.increaseAria": "Aumentar cantidad de {name}",
        "cart.removeAria": "Eliminar {name} del carrito",

        // Auth
        "login.title": "Iniciar Sesión",
        "login.noAccount": "¿No tienes una cuenta?",
        "login.registerHere": "Regístrate aquí",
        "login.username": "Usuario",
        "login.password": "Contraseña",
        "login.submit": "Iniciar Sesión",
        "register.title": "Crear Cuenta",
        "register.subtitle": "Únete para comenzar a comprar",
        "register.fullName": "Nombre Completo",
        "register.email": "Correo Electrónico",
        "register.username": "Usuario",
        "register.password": "Contraseña",
        "register.passwordPlaceholder": "Mínimo 6 caracteres",
        "register.submit": "Registrarse",
        "register.registering": "Registrando...",
        "register.alreadyAccount": "¿Ya tienes una cuenta? Inicia sesión",

        // Footer
        "footer.catalog": "Catálogo",
        "footer.about": "Nosotros",
        "footer.contact": "Contacto",
        "footer.privacy": "Política de Privacidad",
        "footer.rights": "Todos los derechos reservados.",

        // Banners
        "academic.title": "Aviso de Proyecto Académico",
        "academic.text": "Esta tienda es un proyecto de portafolio y demostración académica. Las órdenes, transacciones e inventario son simulados.",
        "academic.dismiss": "Entendido",
        "cookie.text": "Utilizamos cookies para mejorar tu experiencia. Al continuar visitando este sitio aceptas nuestro uso de cookies.",
        "cookie.privacy": "Política de Privacidad",
        "cookie.accept": "Aceptar Cookies",

        // Pagination
        "pagination.page": "Página",
        "pagination.of": "de",
        "pagination.previous": "Anterior",
        "pagination.next": "Siguiente",

        // Language Dropdown
        "nav.selectLanguage": "Seleccionar idioma",

        // About Us Page
        "about.title": "Sobre Nosotros",
        "about.subtitle": "Conoce la historia detrás de ShelfMart",
        "about.historyTitle": "Nuestra Historia",
        "about.historyText": "Nacimos de la necesidad de ofrecer productos de alta calidad y accesibles para todos. Lo que comenzó como un proyecto universitario se ha convertido en una plataforma completa que conecta las mejores marcas con clientes en todo el país.",
        "about.missionTitle": "Nuestra Misión",
        "about.missionText": "Brindar una experiencia de compra rápida, segura e intuitiva, asegurando siempre el mejor catálogo de productos para nuestra comunidad.",
        "about.visionTitle": "Nuestra Visión",
        "about.visionText": "Convertirnos en la tienda en línea líder del país, destacándonos por nuestra innovación tecnológica y un servicio al cliente impecable.",

        // Contact Page
        "contact.title": "Contáctanos",
        "contact.subtitle": "¿Tienes alguna duda o consulta? Estamos a tu disposición a través de cualquiera de nuestros canales oficiales.",
        "contact.customerService": "Atención al Cliente",
        "contact.phone": "Teléfono",
        "contact.email": "Correo",
        "contact.socialMedia": "Nuestras Redes Sociales",

        // Privacy Policy Page
        "privacy.title": "Política de Privacidad",
        "privacy.welcome": "Bienvenido a la Política de Privacidad de ShelfMart. Nos tomamos tu privacidad muy en serio.",
        "privacy.dataCollectionTitle": "Recopilación de Datos",
        "privacy.dataCollectionText": "Recopilamos la información que nos proporcionas directamente al crear una cuenta, realizar una compra o comunicarte con nosotros.",
        "privacy.dataUseTitle": "Uso de los Datos",
        "privacy.dataUseText": "Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, así como para procesar tus transacciones.",

        // Profile Page
        "profile.title": "Mi Perfil",
        "profile.subtitle": "Administra tu cuenta de usuario y consulta tu historial de compras.",
        "profile.personalInfo": "Información Personal",
        "profile.fullName": "Nombre Completo",
        "profile.username": "Usuario",
        "profile.accountType": "Tipo de Cuenta",
        "profile.roleAdmin": "Administrador de la Empresa",
        "profile.roleCustomer": "Cliente Habitual",
        "profile.history": "Historial de Compras",
        "profile.loading": "Cargando tus compras...",
        "profile.noOrders": "Aún no has realizado ninguna compra en la tienda.",
        "profile.orderId": "ID de Orden:",
        "profile.totalAmount": "Monto Total",
        "profile.cancelOrder": "Cancelar orden",
        "profile.cancelOrderTitle": "Cancelar Orden",
        "profile.cancelOrderConfirm": "¿Deseas cancelar esta orden? Esta acción no se puede deshacer.",
        "profile.cancelSuccess": "Orden cancelada.",
        "profile.cancelError": "No se pudo cancelar la orden.",
        "profile.statusPending": "Pendiente",
        "profile.statusConfirmed": "Confirmada",
        "profile.statusShipped": "Enviada",
        "profile.statusDelivered": "Entregada",
        "profile.statusCancelled": "Cancelada",

        // Not Found (404)
        "notFound.title": "Página No Encontrada",
        "notFound.text": "La página que buscas no existe o ha sido movida a otra ubicación.",
        "notFound.backHome": "Volver al Inicio",

        // Admin Navigation
        "adminNav.dashboard": "Panel de Control",
        "adminNav.products": "Productos",
        "adminNav.orders": "Órdenes",
        "adminNav.users": "Usuarios",
        "adminNav.auditLog": "Registro de Auditoría"
    },
    en: {
        // Navigation & Header
        "nav.catalog": "Catalog",
        "nav.about": "About",
        "nav.contact": "Contact",
        "nav.admin": "Admin",
        "nav.signIn": "Sign In",
        "nav.createAccount": "Create Account",
        "nav.myProfile": "My Profile",
        "nav.myCart": "My Cart",
        "nav.logOut": "Log Out",
        "nav.viewCart": "View cart",
        "nav.openMenu": "Open main menu",
        "nav.closeMenu": "Close main menu",

        // Common
        "common.back": "Back",
        "common.save": "Save",
        "common.cancel": "Cancel",
        "common.confirm": "Confirm",
        "common.delete": "Delete",

        // Categories
        "cat.All": "All",
        "cat.Beauty": "Beauty",
        "cat.Books": "Books",
        "cat.Clothing": "Clothing",
        "cat.Electronics": "Electronics",
        "cat.Furniture": "Furniture",
        "cat.Groceries": "Groceries",
        "cat.Home": "Home",
        "cat.Sports": "Sports",

        // Store / Catalog
        "store.title": "Product Catalog",
        "store.subtitle": "Explore our selection and find what you need.",
        "store.searchPlaceholder": "Search products by name or category...",
        "store.searchLabel": "Search products",
        "store.addToCart": "Add to Cart",
        "store.soldOut": "Sold Out",
        "store.onlyLeft": "Only {count} left!",
        "store.new": "New",
        "store.featured": "Featured",
        "store.noProducts": "No products available",
        "store.noProductsDesc": "Try selecting a different category.",
        "store.tryCategory": "Try selecting a different category.",
        "store.results": "results",
        "store.discountOff": "-{pct}% OFF",
        "store.viewDetailsFor": "View details for {name}",
        "store.addToCartAria": "Add {name} to cart",

        // Home
        "home.heroTitle": "Welcome to ShelfMart!",
        "home.heroSubtitle": "Thoughtfully sourced pieces for a home that feels considered, not decorated.",
        "home.exploreCatalog": "Explore our catalog",
        "home.featuredDeals": "Featured Deals",
        "home.newArrivals": "New Arrivals",
        "home.limitedStock": "Limited Stock",
        "home.lowStock": "Low stock",
        "home.lowStockBadge": "Low stock",

        // Product Detail
        "detail.home": "Home",
        "detail.catalog": "Catalog",
        "detail.newArrival": "New Arrival",
        "detail.inStock": "In Stock ({count} units available)",
        "detail.lowStock": "Low Stock: Only {count} left!",
        "detail.soldOut": "Sold Out",
        "detail.outOfStock": "Currently Out of Stock",
        "detail.description": "Description",
        "detail.quantity": "Quantity:",
        "detail.maxPerPurchase": "Max {count} per purchase",
        "detail.addToCart": "Add to Cart",
        "detail.buyNow": "Buy Now",
        "detail.adding": "Adding...",
        "detail.processing": "Processing...",
        "detail.delivery": "Fast & secure delivery",
        "detail.genuine": "100% Genuine product",
        "detail.returns": "30-Day return policy",
        "detail.moreIn": "More in {category}",
        "detail.viewAll": "View all",
        "detail.notFound": "Product Not Found",
        "detail.notFoundDesc": "The item you are searching for might have been moved or is no longer available in our catalog.",
        "detail.returnToCatalog": "Return to Catalog",

        // Product (used by ProductDetail.tsx)
        "product.notFound": "Product Not Found",
        "product.notFoundDesc": "The item you are searching for might have been moved or is no longer available in our catalog.",
        "product.returnToCatalog": "Return to Catalog",
        "product.newArrival": "New Arrival",
        "product.noImage": "No image available",
        "product.save": "Save {pct}%",
        "product.inStock": "In Stock ({count} units available)",
        "product.lowStock": "Low Stock: Only {count} left!",
        "product.description": "Description",
        "product.quantity": "Quantity:",
        "product.decreaseQuantity": "Decrease quantity",
        "product.increaseQuantity": "Increase quantity",
        "product.maxPerPurchase": "Max {count} per purchase",
        "product.addToCart": "Add to Cart",
        "product.buyNow": "Buy Now",
        "product.adding": "Adding...",
        "product.processing": "Processing...",
        "product.outOfStock": "Currently Out of Stock",
        "product.fastDelivery": "Fast & secure delivery",
        "product.genuine": "100% Genuine product",
        "product.returnPolicy": "30-Day return policy",
        "product.moreIn": "More in {category}",
        "product.viewAll": "View all",
        "product.discountOff": "-{pct}% OFF",
        "product.signInRequired": "Please sign in to add items to your cart.",
        "product.adminRestriction": "Admin accounts cannot make purchases.",
        "product.addedToCartToast": "{quantity} {unit} of \"{name}\" added to cart!",
        "product.unit": "unit",
        "product.units": "units",

        // Cart
        "cart.title": "My Shopping Cart",
        "cart.myCart": "My Shopping Cart",
        "cart.empty": "Your cart is empty",
        "cart.backToCatalog": "Back to catalog",
        "cart.product": "Product",
        "cart.unitPrice": "Unit Price",
        "cart.quantity": "Quantity",
        "cart.subtotal": "Subtotal",
        "cart.actions": "Actions",
        "cart.price": "Price",
        "cart.total": "Total:",
        "cart.totalDue": "Total due:",
        "cart.completePurchase": "Complete Purchase",
        "cart.processing": "Processing...",
        "cart.loading": "Loading cart...",
        "cart.removeItemTitle": "Remove Item",
        "cart.removeItemConfirm": "Do you want to remove this product from the cart?",
        "cart.removeItemMsg": "Do you want to remove this product from the cart?",
        "cart.removeItem": "Remove",
        "cart.remove": "Remove",
        "cart.confirmPurchaseTitle": "Confirm Purchase",
        "cart.confirmPurchasePrompt": "Do you want to confirm your purchase? This action cannot be undone.",
        "cart.confirmPurchaseMsg": "Do you want to confirm your purchase? This action cannot be undone.",
        "cart.confirmPurchase": "Confirm Purchase",
        "cart.removedToast": "Product removed from cart",
        "cart.purchasedToast": "Purchase processed successfully!",
        "cart.decreaseAria": "Decrease quantity of {name}",
        "cart.increaseAria": "Increase quantity of {name}",
        "cart.removeAria": "Remove {name} from cart",

        // Auth
        "login.title": "Sign In",
        "login.noAccount": "Don't have an account?",
        "login.registerHere": "Register here",
        "login.username": "Username",
        "login.password": "Password",
        "login.submit": "Sign In",
        "register.title": "Create Account",
        "register.subtitle": "Join us to start shopping",
        "register.fullName": "Full Name",
        "register.email": "Email",
        "register.username": "Username",
        "register.password": "Password",
        "register.passwordPlaceholder": "Minimum 6 characters",
        "register.submit": "Register",
        "register.registering": "Registering...",
        "register.alreadyAccount": "Already have an account? Sign in",

        // Footer
        "footer.catalog": "Catalog",
        "footer.about": "About",
        "footer.contact": "Contact",
        "footer.privacy": "Privacy Policy",
        "footer.rights": "All rights reserved.",

        // Banners
        "academic.title": "Academic Project Notice",
        "academic.text": "This store is a portfolio and academic demonstration project. Orders, transactions, and inventory are simulated.",
        "academic.dismiss": "Dismiss",
        "cookie.text": "We use cookies to improve your experience. By continuing to visit this site you agree to our use of cookies.",
        "cookie.privacy": "Privacy Policy",
        "cookie.accept": "Accept Cookies",

        // Pagination
        "pagination.page": "Page",
        "pagination.of": "of",
        "pagination.previous": "Previous",
        "pagination.next": "Next",

        // Language Dropdown
        "nav.selectLanguage": "Select language",

        // About Us Page
        "about.title": "About Us",
        "about.subtitle": "Get to know the story behind ShelfMart",
        "about.historyTitle": "Our History",
        "about.historyText": "We were born out of the need to offer high-quality products accessible to everyone. What started as a small university project has now grown into a complete platform that seeks to connect the best brands with our customers nationwide.",
        "about.missionTitle": "Our Mission",
        "about.missionText": "To provide a fast, secure, and intuitive shopping experience, always ensuring the best product catalog for our community.",
        "about.visionTitle": "Our Vision",
        "about.visionText": "To become the country's leading online store, standing out for our technological innovation and impeccable customer service.",

        // Contact Page
        "contact.title": "Contact Us",
        "contact.subtitle": "Have a question or inquiry? We're here to help you through any of our official channels.",
        "contact.customerService": "Customer Service",
        "contact.phone": "Phone",
        "contact.email": "Email",
        "contact.socialMedia": "Our Social Media",

        // Privacy Policy Page
        "privacy.title": "Privacy Policy",
        "privacy.welcome": "Welcome to ShelfMart's Privacy Policy. We take your privacy seriously.",
        "privacy.dataCollectionTitle": "Data Collection",
        "privacy.dataCollectionText": "We collect information you provide directly to us when you create an account, make a purchase, or communicate with us.",
        "privacy.dataUseTitle": "Use of Data",
        "privacy.dataUseText": "We use the information we collect to provide, maintain, and improve our services, and to process your transactions.",

        // Profile Page
        "profile.title": "My Profile",
        "profile.subtitle": "Manage your user account and view your purchase history.",
        "profile.personalInfo": "Personal Information",
        "profile.fullName": "Full Name",
        "profile.username": "Username",
        "profile.accountType": "Account Type",
        "profile.roleAdmin": "Company Administrator",
        "profile.roleCustomer": "Regular Customer",
        "profile.history": "Purchase History",
        "profile.loading": "Loading your purchases...",
        "profile.noOrders": "You haven't made any purchases in the store yet.",
        "profile.orderId": "Order ID:",
        "profile.totalAmount": "Total Amount",
        "profile.cancelOrder": "Cancel order",
        "profile.cancelOrderTitle": "Cancel Order",
        "profile.cancelOrderConfirm": "Do you want to cancel this order? This action cannot be undone.",
        "profile.cancelSuccess": "Order cancelled.",
        "profile.cancelError": "Could not cancel the order.",
        "profile.statusPending": "Pending",
        "profile.statusConfirmed": "Confirmed",
        "profile.statusShipped": "Shipped",
        "profile.statusDelivered": "Delivered",
        "profile.statusCancelled": "Cancelled",

        // Not Found (404)
        "notFound.title": "Page Not Found",
        "notFound.text": "The page you are looking for does not exist or has been moved to another location.",
        "notFound.backHome": "Back to Home",

        // Admin Navigation
        "adminNav.dashboard": "Dashboard",
        "adminNav.products": "Products",
        "adminNav.orders": "Orders",
        "adminNav.users": "Users",
        "adminNav.auditLog": "Audit Log"
    }
};

export interface LocalizedProductInfo {
    esName: string;
    esDescription: string;
}

export const productCatalogTranslations: Record<string, LocalizedProductInfo> = {
    // Electronics
    "Sony WH-1000XM5 Wireless Headphones": {
        esName: "Auriculares Inalámbricos Sony WH-1000XM5",
        esDescription: "Auriculares inalámbricos de diadema líderes en cancelación de ruido con 30 horas de autonomía."
    },
    "Logitech MX Master 3S Wireless Mouse": {
        esName: "Ratón Inalámbrico Logitech MX Master 3S",
        esDescription: "Ratón ergonómico de alto rendimiento con clics silenciosos y sensor 8K DPI sobre cristal."
    },
    "Apple Magic Wireless Keyboard": {
        esName: "Teclado Inalámbrico Apple Magic Keyboard",
        esDescription: "Teclado ultraplano recargable con cómodo mecanismo de tijera y diseño macOS."
    },
    "Apple iMac 27-inch 5K Retina All-in-One Desktop": {
        esName: "Apple iMac 27 Pulgadas 5K Retina Todo en Uno",
        esDescription: "Ordenador de sobremesa todo en uno con impresionante pantalla Retina 5K, Magic Keyboard y Magic Trackpad."
    },
    "Minimalist Matte White Smartwatch with Silicone Band": {
        esName: "Reloj Inteligente Blanco Mate Minimalista",
        esDescription: "Elegante reloj inteligente digital circular con correa deportiva de silicona blanca y sensores de salud."
    },
    "Xiaomi Mi 20,800mAh Fast Charging Power Bank": {
        esName: "Batería Externa Xiaomi Mi 20.800mAh Carga Rápida",
        esDescription: "Batería portátil de aluminio anodizado de alta capacidad con doble puerto USB y carga móvil rápida."
    },

    // Clothing & Apparel
    "Graphic Print Beige Cotton Crewneck T-Shirt": {
        esName: "Camiseta Beige de Cuello Redondo con Estampado",
        esDescription: "Camiseta premium 100% algodón peinado con diseño artístico japonés del Gato de la Suerte."
    },
    "Levi's 511 Slim Fit Stretch Denim Jeans (Trio)": {
        esName: "Pantalones Vaqueros Elásticos Levi's 511 Slim Fit",
        esDescription: "Vaqueros auténticos clásicos de Levi's en lavado azul claro, índigo oscuro y negro sólido."
    },
    "Nike Free RN Flyknit Crimson Running Shoes": {
        esName: "Zapatillas de Running Nike Free RN Flyknit Carmesí",
        esDescription: "Zapatillas de asfalto superligeras y transpirables con empeine Flyknit y amortiguación dinámica."
    },
    "Zara Faux Leather Biker Moto Jacket": {
        esName: "Chaqueta Biker Moto de Piel Sintética Zara",
        esDescription: "Chaqueta motera clásica con cremallera asimétrica confeccionada en suave piel sintética con herrajes plateados."
    },
    "Round Gold Metal Frame Polarized Sunglasses": {
        esName: "Gafas de Sol Polarizadas con Montura Metálica Dorada",
        esDescription: "Gafas de sol redondas de estilo retro con montura metálica pulida en oro y cristales protectores UV verde oscuro."
    },
    "Urban Commuter Minimalist Laptop Backpack 25L": {
        esName: "Mochila Minimalista para Portátil Urban Commuter 25L",
        esDescription: "Mochila urbana negra impermeable para el día a día con compartimento acolchado para portátil."
    },
    "Bespoke Three-Piece Plaid Wool Suit (Navy Blue)": {
        esName: "Traje de Lana de Tres Piezas a Cuadros (Azul Marino)",
        esDescription: "Traje sastre formal de corte impecable compuesto por chaqueta a cuadros, chaleco a juego y pantalón de pinzas."
    },

    // Groceries & Gourmet
    "Specialty Ethiopian Whole Bean Coffee (12oz)": {
        esName: "Café de Especialidad Etíope en Grano (12oz)",
        esDescription: "Granos de café arábica lavado de origen único con notas vibrantes de bergamota, melocotón y jazmín floral."
    },
    "Organic Herbal Pyramid Tea Bags (Gift Box)": {
        esName: "Bolsitas de Té Herbal Orgánico en Pirámide (Caja Regalo)",
        esDescription: "Té herbal artesanal en hojas sueltas en infusores piramidales biodegradables para una infusión aromática y suave."
    },
    "Organic Extra Virgin Olive Oil (500ml)": {
        esName: "Aceite de Oliva Virgen Extra Ecológico (500ml)",
        esDescription: "Aceite de oliva virgen extra prensado en frío de aceitunas Koroneiki con acabado aromático y picante."
    },
    "Fresh Organic Whole Seedless Watermelon": {
        esName: "Sandía Entera Sin Semillas Ecológica y Fresca",
        esDescription: "Sandía entera dulce, crujiente y altamente hidratante recolectada directamente de huertos ecológicos."
    },
    "Artisanal White Chocolate Bar with Roasted Almonds": {
        esName: "Tableta de Chocolate Blanco Artesanal con Almendras Tostadas",
        esDescription: "Cremoso chocolate blanco de estilo suizo con abundantes almendras enteras tostadas y crujientes."
    },
    "Dark Roast Fresh Espresso Coffee with Crema": {
        esName: "Café Espresso Tueste Intenso con Crema Natural",
        esDescription: "Intenso café espresso de cuerpo completo servido en taza de cerámica con espesa capa de crema dorada."
    },

    // Home & Living
    "Ultra-Plush Hotel Down Alternative Sleeping Pillow": {
        esName: "Almohada Hotelera de Firmeza Media Alternativa a Plumón",
        esDescription: "Almohada hipoalergénica con funda de algodón 100% transpirable para un descanso reparador."
    },
    "Botanical Amber Glass Dropper Bottle (50ml)": {
        esName: "Frasco Botánico Gotero de Vidrio Ámbar (50ml)",
        esDescription: "Frasco de vidrio ámbar con pipeta cuentagotas para aceites esenciales, sérums y preparados botánicos."
    },
    "Matte Olive Green Insulated Thermos Bottle (24oz)": {
        esName: "Botella Térmica Verde Oliva Mate (24oz)",
        esDescription: "Termo de acero inoxidable con aislamiento al vacío de doble pared que conserva la temperatura horas."
    },
    "Scandinavian Minimalist Wall Clock & Ceramic Planter Set": {
        esName: "Reloj de Pared Escandinavo y Macetero de Cerámica",
        esDescription: "Conjunto de decoración con reloj de madera de estilo nórdico y macetero cerámico minimalista."
    },
    "Architectural Modern Residence Architecture Plan Blueprint": {
        esName: "Plano Arquitectónico de Residencia Moderna Contemporánea",
        esDescription: "Diseño y planos completos para residencia contemporánea de concepto abierto de dos plantas con asesoría."
    },

    // Sports & Fitness
    "Manduka Studio High-Density Yoga Mat Roll": {
        esName: "Esterilla de Yoga Profesional Manduka de Alta Densidad",
        esDescription: "Esterilla antideslizante con textura de agarre y óptima amortiguación para práctica en estudio o en casa."
    },
    "Commercial Grade Heavy Hex Dumbbells Rack Set": {
        esName: "Juego de Mancuernas Hexagonales de Grado Profesional",
        esDescription: "Mancuernas hexagonales de hierro fundido recubiertas de goma para entrenamientos exigentes de fuerza."
    },
    "Morning Sunrise Outdoor Yoga Fitness Session": {
        esName: "Sesión de Yoga al Aire Libre al Amanecer",
        esDescription: "Pase de entrenamiento guiado de vinyasa yoga y flexibilidad al amanecer con vistas panorámicas."
    },

    // Beauty & Personal Care
    "Curology Gentle Daily Cleanser (80ml)": {
        esName: "Limpiador Facial Suave Diario Curology (80ml)",
        esDescription: "Limpiador facial espumoso no comedogénico formulado por dermatólogos que limpia en profundidad sin resecar."
    },
    "Luxury Botanical Skincare & Jade Roller Routine Set": {
        esName: "Set de Rutina Facial Botánico de Lujo con Rodillo de Jade",
        esDescription: "Colección completa de cuidado facial con gel limpiador, crema hidratante, bálsamo y rodillo de jade natural."
    },

    // Books & Knowledge
    "Reading Essentials: Open Paperback Book & Coffee Set": {
        esName: "Esenciales de Lectura: Libro y Taza de Café",
        esDescription: "Cuaderno de lectura y kit para disfrutar de momentos de estudio, lectura y café con total calma."
    },
    "Milk and Honey by Rupi Kaur (Hardcover Edition)": {
        esName: "Otras Maneras de Usar la Boca (Milk and Honey) de Rupi Kaur",
        esDescription: "Edición de tapa dura del aclamado poemario superventas de Rupi Kaur sobre amor, pérdida y superación."
    },
    "The Psychology of Money by Morgan Housel": {
        esName: "La Psicología del Dinero de Morgan Housel",
        esDescription: "Lecciones atemporales sobre la riqueza, la ambición y la toma de decisiones financieras racionales."
    },

    // Furniture
    "French Provincial Button-Tufted Cream Accent Chair": {
        esName: "Sillón de Acento Crema Estilo Francés con Capitoné",
        esDescription: "Elegante butaca de madera tallada con tapizado aterciopelado en color crema y fino acabado acolchado."
    },
    "Ergonomic High-Back Mesh Executive Office Chair": {
        esName: "Silla de Oficina Ergonómica con Respaldo de Malla",
        esDescription: "Silla ejecutiva transpirable con soporte lumbar, brazos ajustables 3D y regulación neumática."
    },

    // Test & Demo items
    "Ergonomic Standing Desk": {
        esName: "Escritorio Elevable Ergonómico",
        esDescription: "Escritorio eléctrico de bambú macizo con altura regulable y ajustes programables de memoria."
    },
    "Wireless Mouse": {
        esName: "Ratón Inalámbrico",
        esDescription: "Ratón inalámbrico ergonómico de alta precisión."
    },
    "Product A": {
        esName: "Producto A",
        esDescription: "Descripción del Producto A."
    }
};

/**
 * Returns a product object with translated name and description when in Spanish.
 */
export function translateProduct<T extends { name: string; description?: string; category?: string }>(
    product: T,
    language: "es" | "en"
): T {
    if (language !== "es" || !product?.name) return product;

    const matchedKey = Object.keys(productCatalogTranslations).find(
        (key) => key.toLowerCase() === product.name.trim().toLowerCase()
    );

    if (!matchedKey) return product;

    const trans = productCatalogTranslations[matchedKey];
    return {
        ...product,
        name: trans.esName,
        description: trans.esDescription || product.description
    };
}

/**
 * Returns a translated product name string when in Spanish.
 */
export function translateProductName(name: string, language: "es" | "en"): string {
    if (language !== "es" || !name) return name;

    const matchedKey = Object.keys(productCatalogTranslations).find(
        (key) => key.toLowerCase() === name.trim().toLowerCase()
    );

    return matchedKey ? productCatalogTranslations[matchedKey].esName : name;
}


