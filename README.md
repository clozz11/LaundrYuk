# LaundryYuk

LaundryYuk is a laundry-service web application with a React frontend and an
Express API backed by MySQL. Customers can register, book laundry services,
track orders, and leave feedback. Admins can review orders and update their
status.

## Tech stack

- **Frontend:** React, Vite, React Router
- **Backend:** Node.js, Express, JSON Web Tokens (JWT)
- **Database:** MySQL

## Requirements

- Node.js 20.19+ or 22.12+ and npm.
- MySQL 8+ (XAMPP is suitable for local development).

## Local setup

### 1. Create the database

Import [`laundryyuk-backend/database/schema.sql`](laundryyuk-backend/database/schema.sql)
into MySQL using phpMyAdmin or the MySQL command-line client. The script creates
the `laundryyuk` database, required tables, service-price records, and the
`sp_update_status` stored procedure used by the API.

### 2. Configure and start the backend

```powershell
cd laundryyuk-backend
Copy-Item .env.example .env
npm install
```

Update `.env` with your local MySQL settings. Set `JWT_SECRET` to a private,
random value; generate one with:

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the generated value into `.env`. Never commit `.env` or share its values.
Start the API:

```powershell
npm start
```

The API listens on `http://localhost:5000` by default.

### 3. Configure and start the frontend

Open another terminal from the project root:

```powershell
cd laundryyuk-frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.
The frontend defaults to the local API. For another API host, create
`laundryyuk-frontend/.env` and set `VITE_API_URL` to the backend base URL,
without a trailing slash (for example, `https://api.example.com`).

## Admin account

There is no built-in admin password. Register an account through the app first,
then promote that account to admin in your local MySQL database:

```sql
USE laundryyuk;
UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
```

Log in again after changing the role so the API issues a token with the updated
role. Admin order endpoints require a valid admin token; customer order and
feedback endpoints require a valid customer token.

## API routes

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/register` | Public | Register a customer |
| `POST` | `/api/login` | Public | Sign in and receive an 8-hour JWT |
| `POST` | `/api/laundry` | Customer | Create an order |
| `GET` | `/api/laundry/proses` | Customer | List the signed-in customer's orders |
| `GET` | `/api/admin/orders` | Admin | List all orders |
| `PUT` | `/api/admin/orders/:id` | Admin | Update an order status |
| `POST` | `/api/laundry/feedback` | Customer | Review one of their completed orders |

## Security notes

Passwords are stored as bcrypt hashes. Protected API requests use the JWT
returned by `/api/login`; the frontend keeps it in browser local storage for
this development project. Use HTTPS in deployments, keep `JWT_SECRET` private,
and do not reuse the local `.env` or sample database with real customer data.
