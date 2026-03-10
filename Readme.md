# Natours — Tour Booking Platform

> A full-stack tour booking application built with **Node.js**, **TypeScript**, **Express**, and **MongoDB** — based on Jonas Schmedtmann's Natours project from his Udemy course, rebuilt from the ground up in TypeScript.

## Preview

> _App runs on [`http://localhost:8000`](http://localhost:8000) — server-side rendered with Pug templates_

## 🧰 Tech Stack

| Layer            | Technology                    |
| ---------------- | ----------------------------- |
| **Runtime**      | Node.js                       |
| **Language**     | TypeScript                    |
| **Framework**    | Express.js                    |
| **Database**     | MongoDB + Mongoose            |
| **Templating**   | Pug                           |
| **Auth**         | JWT (access + refresh tokens) |
| **File Uploads** | Multer + Sharp                |
| **Email**        | Nodemailer                    |
| **Payments**     | Stripe                        |

## Project Architecture

This project follows a strict **MVC (Model-View-Controller)** pattern:

```typescript
natours/
├── src/
│   ├── controllers/        # Route handlers & business logic
│   │   ├── authController.ts
│   │   ├── tourController.ts
│   │   ├── userController.ts
│   │   ├── reviewController.ts
│   │   └── viewsController.ts
│   ├── models/             # Mongoose schemas & models
│   │   ├── tourModel.ts
│   │   ├── userModel.ts
│   │   └── reviewModel.ts
│   ├── routes/             # Express routers
│   │   ├── tourRoutes.ts
│   │   ├── userRoutes.ts
│   │   ├── reviewRoutes.ts
│   │   └── viewRoutes.ts
│   ├── views/              # Pug templates
│   ├── utils/              # AppError, catchAsync, email, etc.
│   ├── middleware/         # Custom middleware
│   ├── types/              # TypeScript type definitions
│   └── app.ts              # Express app setup
├── public/                 # Static assets (css, img, js)
├── .env
├── tsconfig.json
└── package.json
```

## API Routes

### Authentication (`/api/v1/users`)

| Method   | Endpoint                | Access | Description                 |
| -------- | ----------------------- | ------ | --------------------------- |
| `POST`   | `/signup`               | Public | Register a new user         |
| `POST`   | `/login`                | Public | Login with email & password |
| `GET`    | `/logout`               | Public | Clear auth cookie & logout  |
| `POST`   | `/forgotPassword`       | Public | Send password reset email   |
| `PATCH`  | `/resetPassword/:token` | Public | Reset password via token    |
| `PATCH`  | `/updateMyPassword`     | Auth   | Change current password     |
| `GET`    | `/me`                   | Auth   | Get current user's profile  |
| `PATCH`  | `/updateMe`             | Auth   | Update name, email, photo   |
| `DELETE` | `/deleteMe`             | Auth   | Deactivate own account      |
| `GET`    | `/`                     | Admin  | Get all users               |
| `POST`   | `/`                     | Admin  | Create a user               |
| `GET`    | `/:id`                  | Admin  | Get user by ID              |
| `PATCH`  | `/:id`                  | Admin  | Update user by ID           |
| `DELETE` | `/:id`                  | Admin  | Delete user by ID           |

---

### Tours (`/api/v1/tours`)

| Method   | Endpoint                                            | Access           | Description                 |
| -------- | --------------------------------------------------- | ---------------- | --------------------------- |
| `GET`    | `/top-5-cheap`                                      | Public           | Alias: top 5 cheap tours    |
| `GET`    | `/tour-stats`                                       | Public           | Aggregated tour statistics  |
| `GET`    | `/monthly-plan/:year`                               | Admin/Lead/Guide | Monthly plan for a year     |
| `GET`    | `/tours-within/:distance/center/:latlng/unit/:unit` | Public           | Tours within radius         |
| `GET`    | `/distances/:latlng/unit/:unit`                     | Public           | Distances from a point      |
| `GET`    | `/`                                                 | Public           | Get all tours               |
| `POST`   | `/`                                                 | Admin/Lead-Guide | Create a tour               |
| `GET`    | `/:id`                                              | Public           | Get a single tour           |
| `PATCH`  | `/:id`                                              | Admin/Lead-Guide | Update a tour (with images) |
| `DELETE` | `/:id`                                              | Admin/Lead-Guide | Delete a tour               |

---

### Reviews (`/api/v1/reviews` or `/api/v1/tours/:tourId/reviews`)

Supports **nested routes** — reviews can be accessed directly or via their parent tour.

| Method   | Endpoint | Access     | Description                 |
| -------- | -------- | ---------- | --------------------------- |
| `GET`    | `/`      | Auth       | Get all reviews             |
| `POST`   | `/`      | User       | Create a review (on a tour) |
| `GET`    | `/:id`   | Auth       | Get a single review         |
| `PATCH`  | `/:id`   | User/Admin | Update a review             |
| `DELETE` | `/:id`   | User/Admin | Delete a review             |

---

### Views (`/`)

| Method | Endpoint            | Access | Description                   |
| ------ | ------------------- | ------ | ----------------------------- |
| `GET`  | `/`                 | Public | Homepage — all tours overview |
| `GET`  | `/tour/:slug`       | Public | Individual tour detail page   |
| `GET`  | `/login`            | Public | Login form                    |
| `GET`  | `/me`               | Auth   | User account page             |
| `POST` | `/submit-user-data` | Auth   | Update user data from form    |

## Authentication & Authorization

- **JWT** tokens are issued on login/signup and stored in **HTTP-only cookies** for security.
- Routes are protected via the `authController.protect` middleware, which verifies the token on every request.
- Role-based access control is enforced with `authController.restrictTo(...roles)`.

**Available roles:** `user` · `guide` · `lead-guide` · `admin`

## File Uploads

- **User photos** — Uploaded via `multer`, resized and formatted to `jpeg` using `sharp`, saved to `public/img/users/`.
- **Tour images** — Multiple images uploaded per tour (`imageCover` + `images[]`), resized with `sharp`, saved to `public/img/tours/`.

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=8000

DATABASE=mongodb+srv://<user>:<password>@cluster.mongodb.net/natours
DATABASE_PASSWORD=your_db_password

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_USERNAME=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=25
```

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (Atlas or local)
- **pnpm** or **npm** or **yarn**

#### I have used pnpm

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/natours-ts.git
cd natours-ts

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
.env

# 4. Start the development server
pnpm dev
```

### Scripts

| Command               | Description                                      |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Start dev server with `ts-node-dev` (hot reload) |
| `npm run build`       | Compile TypeScript to `dist/`                    |
| `npm start`           | Run compiled JS from `dist/`                     |
| `npm run seed`        | Import sample data into MongoDB                  |
| `npm run seed:delete` | Delete all data from MongoDB                     |

## Rendered Pages

The app uses **Pug** for server-side rendering. Pages include:

- **`/`** — Tour overview with cards and filtering
- **`/tour/:slug`** — Tour detail with map, reviews, and booking
- **`/login`** — Login page
- **`/me`** — User dashboard (update profile, photo, password)
