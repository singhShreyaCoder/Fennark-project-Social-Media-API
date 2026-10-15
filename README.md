# Fennark-project-Social-Media-API

A RESTful Social Media API built with **Node.js**, **Express 5**, and **MongoDB (Mongoose)**. It supports user authentication via JWT stored in HTTP-only cookies, full CRUD on posts, and liking/unliking posts. The project uses ES Modules (`import`/`export`) throughout.

---

## Features

- **User authentication** — signup, login, and logout with `bcryptjs` password hashing.
- **JWT sessions** — tokens signed with a secret and delivered as secure, HTTP-only cookies (7-day expiry).
- **Protected routes** — middleware verifies the JWT cookie before allowing write/like operations.
- **Posts CRUD** — create, read (all + by id), update, and delete posts.
- **Ownership checks** — only a post's author can update or delete it.
- **Likes** — like and unlike a post, with duplicate-like protection.
- **MongoDB connection** — resilient connection helper with a DNS fallback resolver.

---

## Technologies Used

| Category         | Technology                     |
| ---------------- | ------------------------------ |
| Runtime          | Node.js (ES Modules)           |
| Web framework    | Express `^5.2.1`               |
| Database         | MongoDB via Mongoose `^9.10.4` |
| Auth             | jsonwebtoken `^9.0.3` (JWT)    |
| Password hashing | bcryptjs `^3.0.3`              |
| Cookies          | cookie-parser `^1.4.7`         |
| Config           | dotenv `^18.0.5`               |
| Dev tooling      | Node.js `--watch` (built-in)   |

> `cors` is listed in `package.json` but is not yet imported or applied in `src/server.js`.

---

## Project Structure

```
.
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection + DNS fallback logic
│   ├── controllers/
│   │   ├── authController.js     # signup, login, logout handlers
│   │   ├── likesController.js    # likePost, unlikePost handlers
│   │   └── postController.js     # get/create/update/delete post handlers
│   ├── middleware/
│   │   └── authMiddleware.js     # `protect` — JWT cookie verification
│   ├── models/
│   │   ├── postModel.js          # Post schema (image, content, author, likes)
│   │   └── userModel.js          # User schema (Name, Email, Password, ProfilePic)
│   ├── route/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── postRoutes.js         # /api/post routes
│   ├── utils/
│   │   └── generateToken.js      # Signs JWT and sets the auth cookie
│   └── server.js                 # App entry point: middleware + route mounting
├── .env                          # Environment variables (not committed)
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
git clone <repository-url>
cd Fennark-project-Social-Media-API
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
# Optional: comma-separated fallback DNS servers used if the system resolver fails
FALLBACK_DNS=8.8.8.8,1.1.1.1
```

### Running the API

```bash
# Production
npm start

# Development (auto-restarts on file changes)
npm run dev
```

The server starts after the database connection succeeds:

```
MONGODB CONNECTED SUCCESSFULLY <host>
Server started on port:5000
```

---

## API Endpoints

Base URL: `http://localhost:<PORT>`

### Auth — `/api/auth`

| Method | Endpoint  | Access | Description                               |
| ------ | --------- | ------ | ----------------------------------------- |
| POST   | `/signup` | Public | Register a new user (min 8-char password) |
| POST   | `/login`  | Public | Log in and receive a JWT cookie           |
| POST   | `/logout` | Public | Clear the JWT cookie                      |

### Posts — `/api/post`

| Method | Endpoint      | Access    | Description                  |
| ------ | ------------- | --------- | ---------------------------- |
| GET    | `/`           | Public    | Get all posts (newest first) |
| GET    | `/:id`        | Public    | Get a single post by id      |
| POST   | `/`           | Protected | Create a post                |
| PUT    | `/:id`        | Protected | Update a post (author only)  |
| DELETE | `/:id`        | Protected | Delete a post (author only)  |
| POST   | `/:id/likes`  | Protected | Like a post                  |
| DELETE | `/:id/unlike` | Protected | Unlike a post                |

> **Protected** endpoints require a valid `jwt` cookie, which is set automatically on signup/login. The token is signed with `{ userId }` and expires in 7 days.

---

## Data Models

### User

| Field      | Type   | Notes                          |
| ---------- | ------ | ------------------------------ |
| Name       | String | Required, unique               |
| Email      | String | Required, unique               |
| Password   | String | Required, hashed with bcrypt   |
| ProfilePic | String | Defaults to `""`               |
| timestamps | —      | Adds `createdAt` / `updatedAt` |

### Post

| Field      | Type       | Notes                                  |
| ---------- | ---------- | -------------------------------------- |
| image      | String     | Required                               |
| content    | String     | Trimmed, max 3000 chars, defaults `""` |
| author     | ObjectId   | References `User`, required            |
| likes      | ObjectId[] | References `User`                      |
| timestamps | —          | Adds `createdAt` / `updatedAt`         |

---

## Author

**Shreya Kumari**

---

## License

ISC
