# Sistema de Control de Inventario - Frontend App

Este repositorio contiene la aplicación cliente del sistema de control de inventarios. Está desarrollado como una **Single Page Application (SPA)** modular y responsiva, diseñada para consumir los servicios de la API de inventarios de forma segura y eficiente.

La aplicación permite la interacción con el catálogo de productos, carrito de compras, gestión de usuarios, dashboard de analíticas y bitácora de auditoría del sistema.

---

## Tecnologías Utilizadas

| Componente | Tecnología |
| :--- | :--- |
| **Framework de Desarrollo** | React (versión 19) |
| **Herramienta de Construcción** | Vite |
| **Lenguaje** | TypeScript |
| **Estructuración de Estilos** | Tailwind CSS (versión v4) |
| **Enrutamiento** | React Router Dom (versión v7) |
| **Gráficos y Visualización** | Recharts |
| **Notificaciones y Feedback** | React Hot Toast |
| **Cliente HTTP** | Axios |
| **Iconografía** | Lucide React y React Icons |

---

## Estructura de la Aplicación (`/src`)

*   **`components/`**
    *   *Propósito:* Componentes de interfaz compartidos y reutilizables en múltiples vistas (ej. `Navbar`, `Footer`, `Layout`).
*   **`pages/`**
    *   *Propósito:* Vistas principales que componen el flujo de la aplicación:
        *   `Home`: Página de bienvenida de la plataforma.
        *   `Store`: Catálogo interactivo de productos con filtros y paginación.
        *   `Cart`: Detalle del carrito de compras y proceso de checkout.
        *   `Dashboard`: Gráficos y estadísticas clave de ventas e inventario (utilizando Recharts).
        *   `OrdersManager`: Gestión y actualización del estado de las compras/pedidos.
        *   `AuditDashboard`: Registro histórico de actividades críticas (Auditoría/Bitácora) para los administradores.
        *   `Users`: Control y asignación de roles a los usuarios registrados.
        *   `Login` / `Register`: Vistas de acceso y registro de nuevos clientes.
        *   `Profile`: Perfil de usuario y edición de datos personales.
*   **`services/`**
    *   *Propósito:* Clientes y servicios HTTP configurados para interactuar con la API de backend de manera centralizada.
*   **`types/`**
    *   *Propósito:* Tipos e interfaces de TypeScript para mantener la integridad de los datos a lo largo de toda la aplicación.

---

## Patrones de Diseño y Buenas Prácticas Aplicados

*   **Componentización Modular:** Aplicación del *Principio de Responsabilidad Única (SRP)* en los componentes de interfaz para facilitar su reutilización y mantenimiento.
*   **Control de Accesos y Seguridad (Route Guarding):** Protección de rutas en el cliente basada en roles extraídos y decodificados desde los tokens JWT de sesión.
*   **Gestión de Estado Eficiente:** Administración del carrito de compras y el estado de autenticación de forma reactiva, minimizando renders innecesarios.
*   **Abstracción de Servicios:** Centralización de llamadas HTTP mediante servicios dedicados que desacoplan la lógica de consumo de datos de los componentes visuales.
*   **Interfaz Responsiva y Accesible:** Diseño adaptable para diferentes tamaños de pantalla (*Mobile-First*) aplicando buenas prácticas de accesibilidad y transiciones suaves para mejorar la experiencia del usuario.
*   **Carga de Datos Amigable (Skeleton Loaders):** Uso de marcadores de posición durante cargas asíncronas para mejorar el tiempo de carga percibido por el usuario.
