# 🚀 Community Platform — Backend API

A RESTful API server powering a community-driven Q&A and resource-sharing platform. Built with **Node.js**, **Express.js**, and **MongoDB**, it provides secure authentication, community management, threaded discussions, file-based resource sharing, real-time notifications, and a dedicated admin moderation portal.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Authentication](#-authentication)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v4 |
| Database | MongoDB (via Mongoose v8 ODM) |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcryptjs |
| File Uploads | Multer |
| Dev Server | Nodemon |
| Config Management | dotenv |
| Cross-Origin | CORS |

---

## 📁 Project Structure

```
backend/
├── controllers/          # Business logic handlers
│   ├── auth.js           # Signup & login
│   ├── admin.js          # Moderation actions (ban, delete)
│   ├── community.js      # Community CRUD + membership
│   ├── discussion.js     # Discussions, comments, voting
│   ├── notification.js   # Notification read/delete
│   ├── profile.js        # User profile management
│   └── resource.js       # Resource upload & download
├── middleware/
│   ├── auth.js           # JWT Bearer token verification (protect)
│   └── admin.js          # Admin-only route guard
├── models/               # Mongoose schemas
│   ├── User.js
│   ├── Community.js
│   ├── Discussion.js
│   ├── Resource.js
│   └── Notifications.js
├── routes/               # Express routers (7 domains)
│   ├── auth.js
│   ├── admin.js
│   ├── community.js
│   ├── discussion.js
│   ├── notification.js
│   ├── profile.js
│   └── resource.js
├── utilities/
│   └── errorHandler.js   # Global error handler middleware
├── uploads/              # Multer file storage (served statically)
├── .env                  # Environment variables (not committed)
├── .gitignore
├── index.js              # App entry point
└── package.json
```

---

## ✨ Features

### 🔐 Authentication & Security
- User **signup** and **login** with email/password
- Passwords hashed with **bcryptjs** (salt rounds: 10) via a Mongoose pre-save hook
- **JWT-based stateless authentication** — tokens expire in 10 hours
- Protected routes secured via a custom `protect` middleware that validates `Authorization: Bearer <token>` headers
- **Role-based access control (RBAC)** — `isAdmin` and `isBanned` flags on the User model

### 🏘 Community Management
- Create, read, and update communities (public/private)
- Upload community **banner images** via Multer
- Join communities — membership is tracked on both `Community.members[]` and `User.communities[]`
- Ownership checks prevent unauthorized updates or banner changes

### 💬 Discussions
- Create discussions scoped to a specific community
- Threaded **comments** stored as embedded sub-documents
- **Upvote / downvote** system with independent counters
- Fetch all discussions globally or filtered by community
- Mongoose `.populate()` used for relational data (author username, community name, commenter usernames)

### 📦 Resource Sharing
- Share resources as a **URL link** or **uploaded file** (PDF, documents, etc.)
- Resource types: `article`, `video`, `file`, `document`, `other`
- Tag-based categorization
- **Download endpoint** with community-membership authorization gate
- Resources are linked to communities via ObjectId references

### 🔔 Notification System
- Automatic fan-out notifications on key events:
  - A user **joining** a community → notifies the community creator
  - A new **discussion created** → notifies all community members via `Notification.insertMany()`
- Mark individual notifications as **read**
- Delete notifications with ownership validation

### 👤 User Profiles
- Update username and bio
- Upload **profile picture** via Multer
- Fetch own profile (password field excluded via `.select('-password')`)
- Fetch communities by a list of IDs (used by the frontend profile view)

### 🛡 Admin Panel
- **Content moderation** via a keyword-filter engine (`INAPPROPRIATE_WORDS` list)
- Delete inappropriate **resources** (title + tag scanning)
- Delete inappropriate **discussions** and **auto-ban** the author
- Manually **ban any user** with a mandatory reason field
- Create communities as an admin
- All admin routes protected by both `protect` + `isAdmin` middleware chain

---

## 📡 API Reference

> All protected routes require the header: `Authorization: Bearer <token>`

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/signup` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive a JWT token |

### Profile — `/api/profile`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ✅ | Get current user's profile |
| `PUT` | `/` | ✅ | Update username and bio |
| `POST` | `/picture` | ✅ | Upload profile picture |
| `GET` | `/all` | ✅ | Get all users |
| `POST` | `/communities` | ✅ | Get communities by ID list |

### Communities — `/api/communities`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Create a new community |
| `GET` | `/` | ✅ | Get all communities |
| `GET` | `/:communityId` | ✅ | Get a specific community |
| `PUT` | `/:communityId` | ✅ | Update community details (owner only) |
| `POST` | `/:communityId/join` | ✅ | Join a community |
| `POST` | `/:communityId/banner` | ✅ | Upload community banner (owner only) |

### Discussions — `/api/discussions`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Create a new discussion |
| `GET` | `/` | ✅ | Get all discussions |
| `GET` | `/:discussionId` | ✅ | Get a specific discussion |
| `GET` | `/community/:communityId` | ✅ | Get all discussions in a community |
| `POST` | `/:discussionId/comment` | ✅ | Add a comment |
| `PUT` | `/:discussionId/upvote` | ✅ | Upvote a discussion |
| `PUT` | `/:discussionId/downvote` | ✅ | Downvote a discussion |

### Resources — `/api/resources`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Share a resource (link or file upload) |
| `GET` | `/` | ✅ | Get all resources |
| `GET` | `/community/:communityId` | ✅ | Get resources in a community |
| `GET` | `/:resourceId` | ✅ | Get a specific resource |
| `DELETE` | `/:resourceId` | ✅ | Delete own resource |
| `GET` | `/:resourceId/download` | ✅ | Download resource file (members only) |

### Notifications — `/api/notifications`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ✅ | Get all notifications for current user |
| `PUT` | `/:notificationId/read` | ✅ | Mark notification as read |
| `DELETE` | `/:notificationId` | ✅ | Delete a notification |

### Admin — `/api/admin`

| Method | Endpoint | Auth | Admin |
|--------|----------|------|-------|
| `POST` | `/community` | ✅ | ✅ | Create a community |
| `DELETE` | `/resource` | ✅ | ✅ | Delete inappropriate resource |
| `DELETE` | `/discussion` | ✅ | ✅ | Delete discussion & ban author |
| `PUT` | `/ban` | ✅ | ✅ | Ban a user |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Fill in the required values (see Environment Variables below)

# 4. Start the development server
npm start
```

The server will start on `http://localhost:3000` with Nodemon watching for file changes.

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` root with the following:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/community-platform
JWT_SECRET=your_super_secret_jwt_key_here
```

| Variable | Description |
|----------|-------------|
| `PORT` | Port the Express server listens on (default: `3000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## 🔐 Authentication

This API uses **stateless JWT authentication**.

1. Register via `POST /api/auth/signup`
2. Login via `POST /api/auth/login` — you receive a `token` in the response
3. Include the token in all subsequent protected requests:

```
Authorization: Bearer <your_token_here>
```

Token validity: **10 hours**

---

## 📊 Data Models Overview

```
User          → communities[], notifications[]
Community     → createdBy (User), members[] (User), discussions[] (Discussion), resources[] (Resource)
Discussion    → author (User), community (Community), comments[{ user, content }]
Resource      → sharedBy (User), community (Community), tags[]
Notification  → userId (User), communityId (Community), type, isRead
```

---

## 🧑‍💻 Author

Built as a Capstone Project demonstrating full-stack MERN development skills.
