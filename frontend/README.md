# Inventory Control System - Frontend App

This repository contains the client application for the inventory control system. It is built as a modular, responsive **Single Page Application (SPA)** designed to consume the inventory API's services securely and efficiently.

The application enables interaction with the product catalog, shopping cart, user management, analytics dashboard, and the system's audit log.

---

## Technologies Used

| Component | Technology |
| :--- | :--- |
| **Development Framework** | React (version 19) |
| **Build Tool** | Vite |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS (version v4) |
| **Routing** | React Router Dom (version v7) |
| **Charts and Visualization** | Recharts |
| **Notifications and Feedback** | React Hot Toast |
| **HTTP Client** | Axios |
| **Iconography** | Lucide React and React Icons |

---

## Application Structure (`/src`)

*   **`components/`**
    *   *Purpose:* Shared UI components reused across multiple views (e.g. `Navbar`, `Footer`, `Layout`).
*   **`pages/`**
    *   *Purpose:* Main views that make up the application flow:
        *   `Home`: Platform welcome page.
        *   `Store`: Interactive product catalog with filters and pagination.
        *   `Cart`: Shopping cart detail and checkout process.
        *   `Dashboard`: Key sales and inventory charts and statistics (using Recharts).
        *   `OrdersManager`: Management and status updates for purchases/orders.
        *   `AuditDashboard`: Historical log of critical activities (Audit Log) for administrators.
        *   `Users`: Control and role assignment for registered users.
        *   `Login` / `Register`: Sign-in and new customer registration views.
        *   `Profile`: User profile and personal data editing.
*   **`services/`**
    *   *Purpose:* HTTP clients and services configured to interact with the backend API in a centralized way.
*   **`types/`**
    *   *Purpose:* TypeScript types and interfaces to maintain data integrity throughout the application.

---

## Design Patterns and Best Practices Applied

*   **Modular Componentization:** Application of the *Single Responsibility Principle (SRP)* in UI components to ease reuse and maintenance.
*   **Access Control and Security (Route Guarding):** Client-side route protection based on roles extracted and decoded from session JWT tokens.
*   **Efficient State Management:** Reactive management of the shopping cart and authentication state, minimizing unnecessary renders.
*   **Service Abstraction:** Centralization of HTTP calls through dedicated services that decouple data-fetching logic from UI components.
*   **Responsive and Accessible Interface:** Adaptive design for different screen sizes (*Mobile-First*) applying accessibility best practices and smooth transitions to improve the user experience.
*   **Friendly Data Loading (Skeleton Loaders):** Use of placeholders during asynchronous loads to improve the user's perceived load time.
