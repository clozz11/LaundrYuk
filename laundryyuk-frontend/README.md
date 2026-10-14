# LaundryYuk Frontend

React single-page application for the LaundryYuk service. For the complete
database, backend, and admin-account setup, see the
[project README](../README.md).

## Run locally

```powershell
npm install
npm run dev
```

By default, the frontend connects to the API at `http://localhost:5000`. To use
another backend, create a `.env` file in this directory and set
`VITE_API_URL` to the API base URL without a trailing slash.
