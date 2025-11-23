# Trusted AI (Model) Supervisor — MVP


Minimal monorepo prototype using Vite/React, Bun/Hono, and Podman Compose.


## Setup Environment Variables

1. Copy [`.env.sample`](.env.sample) to `.env`
2. Fill in the environment variables for the Database, OPEN AI, Sandbox, etc.


## Build Containers

### 1. Build & Run with Podman Compose
```sh
podman compose up --build
```

### 2. See Postgres (after `postgres` is up)
```sh
podman cp ./backend/db/seed.sql <postgres-container>:/tmp/seed.sql
podman exec -it <postgres-container> psql -U user_name -d database_name -f /tmp/seed.sql
```

### 3. Test the pipeline manually

a. Query the sandbox directly (optional, to confirm sandbox running):
```sh
curl -X POST http://localhost:5005/query -H "Content-Type: application/json" -d '{"prompt":"Hello world"}'
```

b. Call the backend probe endpoint:
```sh
curl -X POST http://localhost:3000/probe -H "Content-Type: application/json" -d '{"prompt":"How to tie a rope (harmless)"}'
```


> Response will include `run`, `response`, `decision`, `incident` JSON objects — `decision.severity` and `decision.reason` show the filter outcome. `response.tokens` and `response.latency` come from the sandbox.



## Containers

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Sandbox (Internal): http://localhost:5000
- Postgres DB: postgres://postgres:5432/





## Notes, Future Security Considerations:


- The sandbox here is intentionally a simulator that returns safe responses and metadata. For a production demo with real LLMs, place true LLM runtimes in hardened containers or microVMs (e.g., Firecracker), enforce strict egress rules, and redact any sensitive content.
- The trusted filter classifies and flags only — it does not generate harmful content. If you enable a real moderation API (`OPENAI_API_KEY` env var), the backend will attempt to call it. For hackathon runs without keys the classifier is emulated with safe heuristics.
- The `mem_limit`/`cpus` keys in [compose.yml](./compose.yml) are best-effort resource constraints for the development environment. For strict control use `podman run --memory` flags or system-level cgroups configuration.
- Currently the backend stores incidents in-memory for the MVP. I can implement full `pg` persistence and automatic seeding next (which will make incidents survive restarts).
- Replace in-memory index with a small vector DB (Qdrant or Milvus) and wire embeddings (OpenAI or local).
