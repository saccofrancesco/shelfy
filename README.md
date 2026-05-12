# Shelfy

## Setup

Install dependencies in both apps:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Environment

The backend reads:

- `PORT` for the API port
- `MONGODB_URI` for the MongoDB connection string
- `MONGODB_DB_NAME` for the database name

The frontend reads:

- `VITE_API_URL` for the API base URL

If those variables are not set, the app falls back to `http://localhost:3000` and `shelfy_db`.

## Scripts

- `npm run dev` starts both frontend and backend together from the repo root
- `npm run dev --prefix backend` starts the API only
- `npm run dev --prefix frontend` starts the frontend only
- `npm run lint --prefix frontend` runs the frontend lint rules
- `npm run build --prefix frontend` builds the frontend for production

## Admin login

The app now supports admin-only login for book management.

- `POST /auth/login` expects `username` and `password`
- `POST /auth/refresh` exchanges a refresh token for a new access token
- `POST /auth/logout` revokes a refresh token

Create an admin user document in the backend database, for example:

```js
{
  username: "admin",
  passwordHash: "<bcrypt hash>",
  role: "admin"
}
```

Only authenticated users can add, edit, or delete books. Reading the shelf remains public.
