# ShelfMart

ShelfMart is a full-stack inventory and e-commerce management platform, composed of a .NET Web API ([backend/](backend/README.md)) and a React + Vite single-page app ([frontend/](frontend/README.md)).

**Live demo:** [shelfmart.vercel.app](https://shelfmart.vercel.app/)

## Screenshots

<!-- TODO: replace with real screenshots -->
<!-- ![Product catalog](docs/screenshots/catalog.png) -->
<!-- ![Admin dashboard](docs/screenshots/dashboard.png) -->
<!-- ![Checkout flow](docs/screenshots/checkout.png) -->

## Local Development

The full stack (backend, frontend, and a local PostgreSQL instance) can be run with Docker Compose:

```bash
cp .env.example .env
# edit .env with your own values (or leave the defaults for local-only testing)
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API / Swagger: http://localhost:8080
- Backend health check: http://localhost:8080/health
- PostgreSQL: localhost:5432

`docker-compose.yml` builds the backend and frontend from their respective Dockerfiles and starts a `postgres:16-alpine` container for local testing, so the real Supabase instance is never touched. See [.env.example](.env.example) for the full list of environment variables.

## Deployment

- **Backend** deploys to [Northflank](https://northflank.com), which auto-detects `backend/Dockerfile` and redeploys on every push to `main`. See [backend/README.md](backend/README.md#deployment-northflank) for the required environment variables.
- **Frontend** deploys to [Vercel](https://vercel.com), which builds and publishes `frontend/` on every push to `main`.
- **Local development** uses Docker Compose, as described above.

## CI/CD

One GitHub Actions workflow lives in [.github/workflows/](.github/workflows/):

- **`ci.yml`** — runs on every pull request and push to `main`. It path-filters so only the affected project builds: `backend-ci` restores, builds, and tests the .NET solution; `frontend-ci` installs dependencies, lints, builds, and tests the React app.

Branch protection requiring these checks to pass before merge is configured directly in the GitHub repository settings.
