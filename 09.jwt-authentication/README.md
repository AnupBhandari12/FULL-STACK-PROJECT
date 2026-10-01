# JWT Authentication API

A backend authentication API built with JavaScript, Bun, Express.js, PostgreSQL, bcrypt, JSON Web Tokens (JWT), and Docker Compose.

The project demonstrates a complete authentication flow including user registration, secure password hashing, login, JWT generation, protected routes, token verification, and token expiration handling.

---

## Features

- User registration
- User login
- Password hashing with bcrypt
- PostgreSQL user storage
- Unique email validation
- JWT token generation
- JWT expiration
- Bearer token authentication
- Authentication middleware
- Protected profile route
- Invalid token handling
- Expired token handling
- Missing token handling
- Safe user responses
- Docker Compose PostgreSQL setup
- Environment variable configuration

---

## Tech Stack

- JavaScript
- Bun
- Express.js
- PostgreSQL
- `pg`
- `bcryptjs`
- `jsonwebtoken`
- Docker
- Docker Compose
- Postman

---

# Authentication Flow

```text
REGISTER

name + email + password
        ↓
Validation
        ↓
Check existing email
        ↓
bcrypt.hash(password)
        ↓
Store password_hash
        ↓
PostgreSQL


LOGIN

email + password
        ↓
Find user
        ↓
bcrypt.compare()
        ↓
Credentials valid?
        ↓
JWT sign
        ↓
Return token


PROTECTED REQUEST

GET /profile
        ↓
Authorization Header
        ↓
Bearer Token
        ↓
Auth Middleware
        ↓
jwt.verify()
        ↓
Decoded User
        ↓
Database
        ↓
Profile Response
```

---

# Project Structure

```text
09.jwt-authentication/
│
├── src/
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── server.js
│   └── db.js
│
├── migrations/
│   └── 001-users.sql
│
├── compose.yml
├── package.json
├── bun.lock
├── .env
├── .gitignore
└── README.md
```

---

# Installation

Install dependencies:

```bash
bun install
```

Dependencies used:

```text
express
pg
bcryptjs
jsonwebtoken
```

Example package.json:

```json
{
  "name": "09.jwt-authentication",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "bun --watch src/server.js",
    "start": "bun src/server.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.23.0"
  }
}
```

---

# Environment Variables

Create `.env`:

```env
DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=jwt_auth

JWT_SECRET=YOUR_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=1h
```

Do not commit `.env`.

Add this to `.gitignore`:

```text
node_modules
.env
```

---

# Generate JWT Secret

Example command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated value into:

```env
JWT_SECRET=generated_value_here
```

---

# Docker Compose

Create `compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: jwt_auth

    ports:
      - "5434:5432"

    volumes:
      - jwt_auth_data:/var/lib/postgresql/data

volumes:
  jwt_auth_data:
```

Start PostgreSQL:

```bash
docker compose up -d
```

Check:

```bash
docker compose ps
```

Stop:

```bash
docker compose down
```

---

# Database Migration

Migration file:

```text
migrations/001-users.sql
```

Contents:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Run migration in PowerShell:

```powershell
Get-Content migrations\001-users.sql | docker compose exec -T postgres psql -U postgres -d jwt_auth
```

---

# Users Table

```text
users
────────────────────
id
name
email
password_hash
created_at
```

Important:

```text
password      ❌
password_hash ✅
```

Plaintext passwords are never stored in the database.

---

# Database Connection

Example `src/db.js`:

```js
import pg from "pg"

const { Pool } = pg

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

pool
  .query("SELECT NOW()")
  .then((result) => {
    console.log("Database connected:", result.rows[0])
  })
  .catch((error) => {
    console.log("Database connection failed:", error.message)
  })
```

---

# Password Hashing

Registration never saves the raw password.

```js
const passwordHash = await bcrypt.hash(
  password,
  10
)
```

Flow:

```text
hello123
↓
bcrypt
↓
$2b$10$....
↓
database
```

The number `10` is the bcrypt cost factor.

---

# Salt

bcrypt automatically uses a salt when creating hashes.

Because of this, the same password can generate different hashes.

Example:

```text
Password:
hello123

Hash 1:
$2b$10$abc...

Hash 2:
$2b$10$xyz...
```

Both can still be verified using:

```js
bcrypt.compare()
```

---

# Password Verification

During login:

```js
const passwordMatch = await bcrypt.compare(
  password,
  user.password_hash
)
```

Result:

```text
Correct password
→ true

Wrong password
→ false
```

The password hash is not decrypted.

---

# API Endpoints

## Register User

```http
POST /register
```

Example:

```text
http://localhost:3000/register
```

Body:

```json
{
  "name": "Anup",
  "email": "anup@example.com",
  "password": "hello123"
}
```

Success:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Anup",
    "email": "anup@example.com",
    "created_at": "..."
  }
}
```

Status:

```text
201 Created
```

The password and password hash are not returned.

---

# Duplicate Email

Registering the same email again:

```json
{
  "message": "Email already registered"
}
```

Status:

```text
409 Conflict
```

---

# Login

```http
POST /login
```

Body:

```json
{
  "email": "anup@example.com",
  "password": "hello123"
}
```

Success:

```json
{
  "message": "Login successful",
  "token": "eyJ...",
  "user": {
    "id": 1,
    "name": "Anup",
    "email": "anup@example.com"
  }
}
```

---

# Invalid Login

Wrong email or wrong password returns the same response:

```json
{
  "message": "Invalid email or password"
}
```

Status:

```text
401 Unauthorized
```

Using the same message avoids revealing which email addresses are registered.

---

# JWT

JWT stands for:

```text
JSON Web Token
```

A token roughly looks like:

```text
xxxxx.yyyyy.zzzzz
```

It has three parts:

```text
Header.Payload.Signature
```

---

# JWT Payload

Example payload:

```json
{
  "userId": 1,
  "email": "anup@example.com"
}
```

Do not put sensitive information in the payload.

Avoid:

```text
password
password hash
JWT secret
private credentials
```

JWT payloads can be decoded and read.

---

# JWT Signing

Token generation:

```js
const token = jwt.sign(
  {
    userId: user.id,
    email: user.email
  },
  process.env.JWT_SECRET,
  {
    expiresIn: process.env.JWT_EXPIRES_IN
  }
)
```

Flow:

```text
Payload
+
JWT Secret
↓
jwt.sign()
↓
Signed Token
```

---

# JWT Verification

Protected requests use:

```js
jwt.verify(
  token,
  process.env.JWT_SECRET
)
```

Verification checks whether the token is valid and whether its signature matches.

---

# Authorization Header

Protected requests send:

```text
Authorization: Bearer TOKEN
```

Example:

```text
Authorization: Bearer eyJhbGciOi...
```

In Postman:

```text
Authorization
↓
Bearer Token
↓
Paste JWT
```

Postman automatically adds the word `Bearer`.

---

# Authentication Middleware

Example `src/middleware/auth.js`:

```js
import jwt from "jsonwebtoken"

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      message: "Authentication required"
    })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.user = decoded

    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired"
      })
    }

    return res.status(401).json({
      message: "Invalid token"
    })
  }
}
```

---

# Middleware Flow

```text
Request
↓
Authorization Header
↓
Bearer Token exists?
↓
Extract token
↓
jwt.verify()
↓
Valid?
├── No → 401
└── Yes
     ↓
req.user = decoded
     ↓
next()
     ↓
Protected route
```

---

# Protected Profile

```http
GET /profile
```

The endpoint uses:

```js
authMiddleware
```

Example:

```js
app.get(
  "/profile",
  authMiddleware,
  async (req, res) => {
    // protected route
  }
)
```

The middleware places decoded JWT data into:

```js
req.user
```

Example:

```js
{
  userId: 1,
  email: "anup@example.com",
  iat: 123456,
  exp: 123999
}
```

The route then uses:

```js
req.user.userId
```

to find the authenticated user.

---

# Profile Query

```sql
SELECT id, name, email, created_at
FROM users
WHERE id = $1;
```

Only safe fields are returned.

---

# Missing Token

Request:

```text
GET /profile
```

without Authorization header.

Response:

```json
{
  "message": "Authentication required"
}
```

Status:

```text
401 Unauthorized
```

---

# Invalid Token

Fake token:

```text
abc123
```

Response:

```json
{
  "message": "Invalid token"
}
```

Status:

```text
401 Unauthorized
```

---

# Token Expiration

Configured using:

```env
JWT_EXPIRES_IN=1h
```

For testing, it was temporarily changed to:

```env
JWT_EXPIRES_IN=10s
```

Flow:

```text
Login
↓
Token generated
↓
10 seconds pass
↓
GET /profile
↓
jwt.verify()
↓
TokenExpiredError
↓
401
```

Response:

```json
{
  "message": "Token expired"
}
```

After testing, expiration was changed back to:

```env
JWT_EXPIRES_IN=1h
```

---

# iat and exp

Decoded JWT may contain:

```json
{
  "iat": 1790826963,
  "exp": 1790830563
}
```

`iat`:

```text
Issued At
```

The time the token was created.

`exp`:

```text
Expiration Time
```

The time after which the token is no longer valid.

---

# Authentication vs Authorization

Authentication means:

```text
Who are you?
```

Example:

```text
Login
```

Authorization means:

```text
What are you allowed to access?
```

Example:

```text
Protected /profile route
```

---

# Security Principles

Passwords are stored as bcrypt hashes.

```text
Plaintext password ❌
bcrypt hash        ✅
```

JWT secrets are stored in environment variables.

```text
JWT secret in GitHub ❌
JWT secret in .env   ✅
```

Password hashes are not returned in API responses.

JWT payload does not contain passwords or password hashes.

Login errors do not reveal whether an email exists.

Parameterized SQL queries are used for database input.

---

# Testing Checklist

```text
POST /register
new user
→ 201

POST /register
same email
→ 409

POST /login
correct credentials
→ 200 + JWT

POST /login
wrong password
→ 401

POST /login
wrong email
→ 401

GET /profile
without token
→ 401 Authentication required

GET /profile
fake token
→ 401 Invalid token

GET /profile
valid token
→ 200 profile

GET /profile
expired token
→ 401 Token expired

Database
→ plaintext password not stored

Database
→ bcrypt password_hash stored
```

---

# Verify Password Storage

Open PostgreSQL:

```bash
docker compose exec postgres psql -U postgres -d jwt_auth
```

Run:

```sql
SELECT id, name, email, password_hash
FROM users;
```

Expected:

```text
password_hash
$2b$10$...
```

Not:

```text
hello123
```

Exit:

```text
\q
```

---

# HTTP Status Codes

```text
200 OK
→ successful login/profile

201 Created
→ successful registration

400 Bad Request
→ missing required input

401 Unauthorized
→ invalid/missing/expired authentication

404 Not Found
→ authenticated user no longer exists

409 Conflict
→ email already registered

500 Internal Server Error
→ unexpected server/database error
```

---

# Useful Docker Commands

Start PostgreSQL:

```bash
docker compose up -d
```

Check:

```bash
docker compose ps
```

Stop:

```bash
docker compose down
```

View logs:

```bash
docker compose logs postgres
```

Open PostgreSQL:

```bash
docker compose exec postgres psql -U postgres -d jwt_auth
```

---

# Run Project

Start database:

```bash
docker compose up -d
```

Start development server:

```bash
bun run dev
```

API:

```text
http://localhost:3000
```

---

# What I Learned

Through this project I practiced:

- Authentication fundamentals
- Authentication vs authorization
- Secure password storage
- bcrypt hashing
- bcrypt salt
- bcrypt password comparison
- PostgreSQL user storage
- Unique email validation
- JWT fundamentals
- JWT header, payload and signature
- JWT signing
- JWT verification
- JWT expiration
- Bearer authentication
- Express middleware
- Protected routes
- HTTP Authorization headers
- Environment variables
- JWT secret management
- HTTP 401 responses
- API security basics
- PostgreSQL queries
- Postman authentication testing
- Debugging JWT and SQL errors

---

# Completion Checklist

```text
✅ User registration
✅ Unique email protection
✅ bcrypt password hashing
✅ No plaintext passwords in database
✅ User login
✅ Password comparison
✅ JWT generation
✅ JWT secret stored in environment variable
✅ Token expiration
✅ Bearer token authentication
✅ Auth middleware
✅ Protected profile
✅ Missing token rejected
✅ Fake token rejected
✅ Expired token rejected
✅ Safe API responses
✅ PostgreSQL persistence
✅ Docker Compose
✅ Postman tests
```

---

# Future Improvements

Possible future improvements:

- Refresh tokens
- Logout/token revocation strategy
- Email verification
- Forgot password
- Password reset
- Rate limiting
- Login attempt protection
- Role-based authorization
- Secure cookies
- Automated tests
- Production deployment
- Swagger/OpenAPI documentation

---

# GitHub Push

Before pushing, confirm `.env` is ignored.

```bash
git status
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "feat: complete JWT authentication API"
```

Push:

```bash
git push
```

---

# Project Status

**Project 09 — User Authentication with JWT ✅ Completed**

Built with:

```text
JavaScript
Bun
Express.js
PostgreSQL
bcrypt
JSON Web Token
Docker Compose
Postman
```