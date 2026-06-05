# OctoFit Tracker Frontend

React 19 presentation tier for the OctoFit Tracker multi-tier application.

## Environment

When running in GitHub Codespaces, `VITE_CODESPACE_NAME` must be defined so the frontend can call the backend API at:

```text
https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

Create `octofit-tracker/frontend/.env.local` with:

```env
VITE_CODESPACE_NAME=your-codespace-name
```

If `VITE_CODESPACE_NAME` is unset, the app safely falls back to `http://localhost:8000/api`.

## Scripts

```bash
npm --prefix octofit-tracker/frontend run dev
npm --prefix octofit-tracker/frontend run build
```

Production builds are written to `octofit-tracker/frontend/dist/`, which is ignored by Git.
