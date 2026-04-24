# MicroMarketUi

MicroMarketUi is a React SPA for the MicroMarket platform.

## Requirements

- [Bun](https://bun.sh)
- A running instance of [MicroMarketApi](https://github.com/Bulgaria2026/MicroMarketApi)

## Configuration

The application requires a backend URL to run. You can manage this using a local `.env` file.

1. Copy the example file to create your local environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Update the values in `.env.local` to match your local setup.

```properties
VITE_API_URL=http://localhost:8080/api/v1
```

---

## Running the Application

Choose the launch configuration that matches your current task.

### 1. Local Frontend Development

Use this mode if you are writing frontend code. You will run the full backend stack in Docker and the UI via Bun for HMR feedback loops.

**Start the backend services:**

Go the the MicroMarketApi Repo and start the development container.

**Install dependencies and start the dev server:**

```bash
bun install
bun run dev
```

The dev server starts on `http://localhost:5173`.

### 2. Production Build

Use this to produce a static build for deployment.

```bash
bun run build
```

Output is written to `dist/`. You can preview it locally with:

```bash
bun run preview
```

---

## Dev Credentials

| Role  | Email                   | Password   |
| ----- | ----------------------- | ---------- |
| Admin | `admin@micromarket.dev` | `admin123` |
| User  | `user@micromarket.dev`  | `user123`  |
