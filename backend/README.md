# Inventory Control System - Backend API

This repository contains the API for the inventory control system. It is built using a **Layered Architecture (N-Tier Architecture)** to ensure modularity, scalability, and a clear separation of concerns. The backend exposes REST services for product catalog management, purchase processing, audit logging, and user authentication.

---

## Technologies Used

| Component | Technology |
| :--- | :--- |
| **Language and Framework** | C# with .NET (ASP.NET Core Web API) |
| **Database** | PostgreSQL |
| **Data Access (ORM)** | Entity Framework Core using Npgsql |
| **API Documentation** | Swagger (Swashbuckle.AspNetCore) with integrated JWT support |
| **Security** | Authentication and Authorization based on JSON Web Tokens (JWT) |

---

## Architecture and Project Structure

The solution is structured into individual projects that logically divide the application's responsibilities:

*   **`ShelfMart.Api`**
    *   *Purpose:* Presentation layer containing the REST controllers, the system middlewares, and the application's dependency configuration in `Program.cs`.
*   **`ShelfMart.Facade`**
    *   *Purpose:* Facade layer that simplifies the data flow between the API and the business logic, serving as a unified interface for the controllers.
*   **`ShelfMart.DomainService`**
    *   *Purpose:* Layer that implements the system's core business logic and domain validations.
*   **`ShelfMart.Domain`**
    *   *Purpose:* Definition of the business domain entities and repository interfaces.
*   **`ShelfMart.Infrastructure`**
    *   *Purpose:* Data persistence layer. Contains the database context configuration (`AppDbContext`), the Entity Framework Core migrations, and the concrete implementation of the repositories.
*   **`ShelfMart.Dto`**
    *   *Purpose:* Data Transfer Objects for safely transferring data between the client and server without directly exposing the domain entities.
*   **`ShelfMart.Exceptions`**
    *   *Purpose:* Custom business exceptions for controlled error flows.

---

## Design Patterns Applied

*   **Layered Architecture:** Enables the separation of the user interface, business logic, and data access.
*   **Facade Pattern:** Provides a unified and simplified interface over a set of interfaces in the services subsystem.
*   **Repository Pattern:** Abstracts the data access logic from the business logic, easing maintenance and future unit testing.
*   **Dependency Injection:** Used natively to resolve dependencies through ASP.NET Core's service containers.

---

## Best Practices and Notable Features

*   **Global Exception Handling:** Uses a custom middleware (`ExceptionMiddleware`) to catch and standardize error responses across the API, avoiding repetitive `try-catch` blocks in controllers.
*   **Security and Authorization:** Implements role-based authorization policies (`Admin`, `Customer`, etc.) to protect critical routes.
*   **Operation Transactionality:** Manages atomic transactions when placing orders and updating stock to prevent inventory inconsistencies.
*   **Asynchronous Programming:** Extensive use of `async/await` in database communication to improve server performance and scalability.

---

## Health Check

The API exposes `GET /health`, returning `200 OK` with a JSON body containing the service status and a UTC timestamp. This endpoint is used by Docker Compose and Northflank for container health checks.

---

## Deployment (Northflank)

The backend is deployed to [Northflank](https://northflank.com) from this repository's `backend/Dockerfile`, which is auto-detected on push to `main`. The container listens on port `8080` and reads its configuration from environment variables:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Not read directly by the app; map it to `ConnectionStrings__DefaultConnection` (Npgsql connection string, e.g. `Host=...;Port=5432;Database=...;Username=...;Password=...;SSL Mode=Require;`). |
| `JWT_SECRET` | Maps to `Jwt__Key`. Secret key used to sign and validate JWTs, at least 32 characters. |
| `CORS_ALLOWED_ORIGINS` | Maps to `Cors__AllowedOrigins`. Comma-separated list of origins allowed to call the API (e.g. the Vercel frontend URL). |

ASP.NET Core reads double-underscore (`__`) separated environment variables as nested configuration keys, so `DATABASE_URL` and `CORS_ALLOWED_ORIGINS` must be set on the platform using their `ConnectionStrings__DefaultConnection` / `Cors__AllowedOrigins` names, or mapped to those names via the platform's environment variable configuration.
