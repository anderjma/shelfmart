# ShelfMart

A full-stack enterprise inventory and e-commerce platform built with **.NET (C#)** and **React + TypeScript**. Designed with a clean layered architecture, role-based access control (RBAC), automated audit logging, resilient error handling, and end-to-end continuous integration.

**Live Demo:** [shelfmart.vercel.app](https://shelfmart.vercel.app/)

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | .NET 8 / C#, ASP.NET Core Web API, Entity Framework Core, JWT Authentication |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Context API |
| **Database** | PostgreSQL, Supabase (Production), EF Core Migrations |
| **Testing** | xUnit, Moq (Backend) / Vitest, React Testing Library, Jest DOM (Frontend) |
| **DevOps & Cloud** | Docker, Docker Compose, GitHub Actions (CI/CD), Vercel, Northflank |

---

## Key Features

- **Layered Architecture & Clean Domain Separation:** Clear boundaries across Domain, Domain Services, Facade, Infrastructure, and API layers.
- **Role-Based Access Control (RBAC):** Granular permissions separating customer operations from administrative dashboards.
- **E-Commerce & Order Management:** Complete product catalog, dynamic filtering, shopping cart, stock deduction checks (`InsufficientStockException`), and order lifecycle tracking.
- **Admin Management Suite:** Comprehensive management for products, categories, orders, users, and sales analytics with interactive charts.
- **Audit Logging System:** Automatic tracking of critical administrative mutations (`AuditLog`) for compliance and data traceability.
- **Centralized Exception Handling:** Custom API middleware translating domain exceptions into structured HTTP response models.
- **Automated CI/CD Pipelines:** Path-filtered GitHub Actions ensuring zero regression across backend builds/tests and frontend linting/testing.

---

## Architecture & System Design

```
ShelfMart Solution
├── backend/
│   ├── src/
│   │   ├── ShelfMart.Domain/            # Core entities (Product, Order, User, AuditLog) & Enums
│   │   ├── ShelfMart.DomainService/     # Business logic & repository orchestrations
│   │   ├── ShelfMart.Facade/            # Unified application service façades
│   │   ├── ShelfMart.Infrastructure/    # EF Core DbContext, Repositories & Migrations
│   │   ├── ShelfMart.Dto/               # Data Transfer Objects & request models
│   │   ├── ShelfMart.Exceptions/        # Domain-specific custom exceptions
│   │   └── ShelfMart.Api/               # REST Controllers, JWT Auth & Middleware
│   └── tests/
│       └── ShelfMart.UnitTests/         # Service & domain entity unit tests
└── frontend/
    └── src/
        ├── features/                    # Domain modules (admin, auth, cart, profile, store)
        ├── lib/                         # API client & AuthContext
        └── shared/                      # Reusable UI components, modals, tables & layouts
```

---

## Local Development

Run the full stack (backend API, frontend SPA, and a dedicated PostgreSQL instance) locally with Docker Compose:

```bash
# 1. Clone the repository
git clone https://github.com/anderjma/shelfmart.git
cd shelfmart

# 2. Configure environment variables
cp .env.example .env

# 3. Spin up all services
docker compose up --build
```

### Local Services & Endpoints

- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **Backend API & Swagger:** [http://localhost:8080](http://localhost:8080)
- **Health Check Endpoint:** [http://localhost:8080/health](http://localhost:8080/health)
- **PostgreSQL Database:** `localhost:5432`

> `docker-compose.yml` uses a local `postgres:16-alpine` container for development and testing, keeping the production database completely isolated.

---

## Testing & Quality Assurance

Automated unit tests validate business rules and UI interactions across both tiers:

```bash
# Run Backend Unit Tests (.NET / xUnit)
dotnet test backend/ShelfMart.slnx

# Run Frontend Unit Tests (Vitest & React Testing Library)
cd frontend && npm test
```

---

## Deployment & CI/CD

- **Frontend:** Hosted on [Vercel](https://vercel.com) with automated builds triggered on every push to `main`.
- **Backend:** Containerized with `Dockerfile` and continuously deployed to [Northflank](https://northflank.com).
- **Continuous Integration (`.github/workflows/ci.yml`):**
  - Path-filtered pipelines execute independently:
    - `backend-ci`: Restores dependencies, compiles solution, and executes xUnit test suite.
    - `frontend-ci`: Installs dependencies, runs ESLint, compiles TypeScript, and runs Vitest suite.
  - Branch protection rules enforce passing CI checks before merging into `main`.