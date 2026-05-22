# Internal Tech Issue & Feature Tracker

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

## Live URL

> Add your Vercel deployment URL here

---

## Tech Stack

- **Runtime:** Node.js (LTS 24.x+)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (raw SQL, `pg` driver only)
- **Auth:** JWT (`jsonwebtoken`) + `bcryptjs`

---

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 11+
- PostgreSQL database (e.g. Neon)

### Installation

```bash
pnpm install
```

### Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=5678
JWT_SECRET_KEY=your_jwt_secret
REFRESH_TOKEN=your_refresh_token_secret
CLIENT_URL=http://localhost:5678
```

### Run Locally

```bash
pnpm dev
```

### Build & Start

```bash
pnpm build
pnpm start
```

---

## User Roles

| Role          | Permissions                                                           |
| ------------- | --------------------------------------------------------------------- |
| `contributor` | Register, login, create issues, view all issues                       |
| `maintainer`  | All contributor permissions + update/delete any issue, access metrics |

---

## API Endpoints

### Auth

| Method | Endpoint           | Access | Description           |
| ------ | ------------------ | ------ | --------------------- |
| POST   | `/api/auth/signup` | Public | Register a new user   |
| POST   | `/api/auth/login`  | Public | Login and receive JWT |

### Issues

| Method | Endpoint          | Access                   | Description                   |
| ------ | ----------------- | ------------------------ | ----------------------------- |
| POST   | `/api/issues`     | Authenticated            | Create a new issue            |
| GET    | `/api/issues`     | Public                   | Get all issues (with filters) |
| GET    | `/api/issues/:id` | Public                   | Get a single issue            |
| PATCH  | `/api/issues/:id` | Maintainer / Issue owner | Update an issue               |
| DELETE | `/api/issues/:id` | Maintainer only          | Delete an issue               |

### Query Parameters for GET /api/issues

| Param    | Values                            | Default  |
| -------- | --------------------------------- | -------- |
| `sort`   | `newest`, `oldest`                | `newest` |
| `type`   | `bug`, `feature_request`          | —        |
| `status` | `open`, `in_progress`, `resolved` | —        |

---

## Database Schema

### users

| Field        | Description                                            |
| ------------ | ------------------------------------------------------ |
| `id`         | Auto-increment primary key                             |
| `name`       | Full name (required)                                   |
| `email`      | Unique email (required)                                |
| `password`   | Hashed password (never returned)                       |
| `role`       | `contributor` or `maintainer` (default: `contributor`) |
| `created_at` | Auto-generated timestamp                               |
| `updated_at` | Auto-updated timestamp                                 |

### issues

| Field         | Description                                         |
| ------------- | --------------------------------------------------- |
| `id`          | Auto-increment primary key                          |
| `title`       | Max 150 characters (required)                       |
| `description` | Min 20 characters (required)                        |
| `type`        | `bug` or `feature_request`                          |
| `status`      | `open`, `in_progress`, `resolved` (default: `open`) |
| `reporter_id` | ID of the user who created the issue                |
| `created_at`  | Auto-generated timestamp                            |
| `updated_at`  | Auto-updated timestamp                              |

---

## Authorization Header

```
Authorization: <JWT_TOKEN>
```

---

## Author

**nirob-sarker**
