# URL Shortener API

A simple URL Shortener API built with Express.js, PostgreSQL, Docker Compose, Bun, and JavaScript.

This application accepts a long URL, generates a short code, stores the URL in PostgreSQL, redirects the short URL to the original URL, and tracks how many times the short URL has been opened.

---

## Features

- Create short URLs
- Validate long URLs
- Generate random short codes
- Save URLs in PostgreSQL
- Redirect short URLs
- Track click count
- View URL statistics
- Handle invalid URLs
- Handle unknown short codes
- PostgreSQL data persistence
- Docker Compose database setup
- Parameterized SQL queries

---

## Tech Stack

- JavaScript
- Bun
- Express.js
- PostgreSQL
- `pg`
- Docker
- Docker Compose
- Postman

---

## Project Flow

```text
Long URL
   ↓
POST /shorten
   ↓
Validate URL
   ↓
Generate Short Code
   ↓
Save in PostgreSQL
   ↓
Return Short URL
   ↓
User Opens Short URL
   ↓
Find Code in Database
   ↓
Increase Click Count
   ↓
Redirect to Original URL
```

---

## Project Structure

```text
07.url-shortener/
│
├── src/
│   ├── server.js
│   └── db.js
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

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

Move into the project folder:

```bash
cd 07.url-shortener
```

Install dependencies:

```bash
bun install
```

---

# package.json

Example:

```json
{
  "name": "07.url-shortener",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "bun --watch src/server.js",
    "start": "bun src/server.js"
  },
  "dependencies": {
    "express": "^5.2.1",
    "pg": "^8.23.0"
  }
}
```

Run development mode:

```bash
bun run dev
```

Run normally:

```bash
bun run start
```

---

# Environment Variables

Create a `.env` file in the project root.

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=url_shortener
```

Do not push `.env` to GitHub.

Add this to `.gitignore`:

```text
node_modules
.env
```

---

# Docker Compose

PostgreSQL runs inside Docker.

Create a file named:

```text
compose.yml
```

Add:

```yaml
services:
  postgres:
    image: postgres:16

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: url_shortener

    ports:
      - "5432:5432"

    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start PostgreSQL:

```bash
docker compose up -d
```

Check container:

```bash
docker compose ps
```

Stop containers:

```bash
docker compose down
```

Start again:

```bash
docker compose up -d
```

The PostgreSQL data remains because a Docker volume is used.

Be careful with:

```bash
docker compose down -v
```

The `-v` option removes the Docker volume and can delete the local database data.

---

# PostgreSQL Database

Open PostgreSQL shell:

```bash
docker compose exec postgres psql -U postgres -d url_shortener
```

Create the `urls` table:

```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(20) UNIQUE NOT NULL,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Check table structure:

```sql
\d urls
```

View stored URLs:

```sql
SELECT * FROM urls;
```

Exit PostgreSQL:

```text
\q
```

---

# Database Structure

The `urls` table stores:

```text
urls
────────────────────────────
id
original_url
short_code
click_count
created_at
```

Example:

```text
id:           1
original_url: https://example.com
short_code:   xf87tx
click_count:  3
created_at:   2026-09-29 ...
```

---

# Database Connection

The application uses the `pg` package to connect JavaScript with PostgreSQL.

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

Flow:

```text
.env
↓
db.js
↓
Pool
↓
PostgreSQL
↓
url_shortener database
```

---

# Express Server

The server uses Express:

```js
import express from "express"
import { pool } from "./db.js"

const app = express()

const PORT = 3000

app.use(express.json())
```

`express.json()` allows Express to read JSON request bodies.

Example:

```json
{
  "originalUrl": "https://example.com"
}
```

This becomes available through:

```js
req.body
```

---

# Short Code Generation

The project generates a short code using JavaScript:

```js
function generateShortCode() {
  return Math.random()
    .toString(36)
    .substring(2, 8)
}
```

Possible result:

```text
xf87tx
```

The short URL becomes:

```text
http://localhost:3000/xf87tx
```

The PostgreSQL column also has a `UNIQUE` constraint:

```sql
short_code VARCHAR(20) UNIQUE NOT NULL
```

---

# API Endpoints

## 1. Create Short URL

Endpoint:

```http
POST /shorten
```

Full URL:

```text
http://localhost:3000/shorten
```

Request body:

```json
{
  "originalUrl": "https://example.com"
}
```

Successful response:

```json
{
  "id": 1,
  "originalUrl": "https://example.com",
  "shortCode": "xf87tx",
  "shortUrl": "http://localhost:3000/xf87tx"
}
```

Status:

```text
201 Created
```

---

## Missing URL

Request:

```json
{}
```

Response:

```json
{
  "message": "URL is required"
}
```

Status:

```text
400 Bad Request
```

---

## Invalid URL

Request:

```json
{
  "originalUrl": "hello123"
}
```

Response:

```json
{
  "message": "Invalid URL"
}
```

Status:

```text
400 Bad Request
```

---

# URL Validation

The project uses:

```js
new URL(originalUrl)
```

Valid example:

```text
https://example.com
```

Invalid example:

```text
hello123
```

Flow:

```text
URL received
↓
new URL(originalUrl)
↓
Valid?
├── No → 400 Invalid URL
└── Yes → Generate short code
```

---

# PostgreSQL INSERT

A URL is stored using:

```js
const result = await pool.query(
  `
    INSERT INTO urls (original_url, short_code)
    VALUES ($1, $2)
    RETURNING *
  `,
  [originalUrl, shortCode]
)
```

Here:

```text
$1 → originalUrl
$2 → shortCode
```

This is called a parameterized query.

Parameterized queries are safer than directly inserting user input into SQL strings.

---

# RETURNING *

The SQL:

```sql
RETURNING *
```

returns the row that was just created.

Example result:

```js
{
  id: 1,
  original_url: "https://example.com",
  short_code: "xf87tx",
  click_count: 0,
  created_at: "..."
}
```

---

# 2. Redirect Short URL

Endpoint:

```http
GET /:shortCode
```

Example:

```text
http://localhost:3000/xf87tx
```

Express receives:

```js
req.params.shortCode
```

Value:

```text
xf87tx
```

The application searches PostgreSQL:

```sql
SELECT *
FROM urls
WHERE short_code = $1;
```

Flow:

```text
GET /xf87tx
↓
shortCode = xf87tx
↓
Search PostgreSQL
↓
URL Found
↓
Increase Click Count
↓
Redirect
```

Redirect is performed using:

```js
res.redirect(url.original_url)
```

Example:

```text
http://localhost:3000/xf87tx
```

redirects to:

```text
https://example.com
```

---

# Unknown Short URL

Example:

```text
http://localhost:3000/notexist123
```

Response:

```json
{
  "message": "Short URL not found"
}
```

Status:

```text
404 Not Found
```

---

# Click Counter

Every successful redirect increases the click count.

SQL:

```sql
UPDATE urls
SET click_count = click_count + 1
WHERE short_code = $1;
```

Example:

```text
Initial click_count
0

Open short URL
↓
1

Open again
↓
2

Open again
↓
3
```

---

# 3. URL Statistics

Endpoint:

```http
GET /stats/:shortCode
```

Example:

```text
http://localhost:3000/stats/xf87tx
```

The server searches:

```sql
SELECT
  id,
  original_url,
  short_code,
  click_count,
  created_at
FROM urls
WHERE short_code = $1;
```

Example response:

```json
{
  "id": 1,
  "originalUrl": "https://example.com",
  "shortCode": "xf87tx",
  "clickCount": 3,
  "createdAt": "2026-09-29T..."
}
```

---

# Route Parameters

Example route:

```js
app.get("/:shortCode", async (req, res) => {
```

If user opens:

```text
/xf87tx
```

Express provides:

```js
req.params.shortCode
```

which contains:

```text
xf87tx
```

Important:

```text
/:shortCode
↓
req.params.shortCode
```

If the route was:

```text
/:code
```

then it would be:

```js
req.params.code
```

The names must match.

---

# Data Persistence

In the previous simple REST API project, data was stored in a JavaScript array.

Example:

```js
const items = []
```

That means:

```text
Server Running
↓
Data Exists in Memory
↓
Server Restart
↓
Array Reset
↓
Data Lost
```

In this project:

```text
Express
↓
PostgreSQL
↓
Disk Storage
↓
Server Restart
↓
Data Still Exists
```

This is called:

```text
Data Persistence
```

---

# Docker Volume Persistence

Docker Compose uses:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

This means PostgreSQL data is stored in a named Docker volume.

Normal:

```bash
docker compose down
```

does not remove the stored database volume.

Starting again:

```bash
docker compose up -d
```

allows the old data to remain available.

---

# Testing with Postman

## Test 1 — Valid URL

Method:

```text
POST
```

URL:

```text
http://localhost:3000/shorten
```

Body:

```json
{
  "originalUrl": "https://example.com"
}
```

Expected:

```text
201 Created
```

---

## Test 2 — Missing URL

Body:

```json
{}
```

Expected:

```text
400 Bad Request
```

Response:

```json
{
  "message": "URL is required"
}
```

---

## Test 3 — Invalid URL

Body:

```json
{
  "originalUrl": "hello123"
}
```

Expected:

```text
400 Bad Request
```

Response:

```json
{
  "message": "Invalid URL"
}
```

---

## Test 4 — Redirect

Open:

```text
http://localhost:3000/YOUR_SHORT_CODE
```

Expected:

```text
Redirect to original URL
```

---

## Test 5 — Unknown Code

Open:

```text
http://localhost:3000/notexist123
```

Expected:

```text
404 Not Found
```

Response:

```json
{
  "message": "Short URL not found"
}
```

---

## Test 6 — Statistics

Open:

```text
http://localhost:3000/stats/YOUR_SHORT_CODE
```

Expected response:

```json
{
  "id": 1,
  "originalUrl": "https://example.com",
  "shortCode": "YOUR_SHORT_CODE",
  "clickCount": 1,
  "createdAt": "..."
}
```

---

## Test 7 — Click Counter

Check stats:

```text
clickCount = 1
```

Open short URL again.

Check stats again:

```text
clickCount = 2
```

---

## Test 8 — Persistence

Create a short URL.

Example:

```text
http://localhost:3000/xf87tx
```

Stop the Express server:

```text
Ctrl + C
```

Start again:

```bash
bun run dev
```

Open the same short URL.

Expected:

```text
Redirect still works
```

This confirms PostgreSQL persistence.

---

# Useful Docker Commands

Start database:

```bash
docker compose up -d
```

View running services:

```bash
docker compose ps
```

View all Docker containers:

```bash
docker ps -a
```

Stop database:

```bash
docker compose down
```

View logs:

```bash
docker compose logs
```

View PostgreSQL logs:

```bash
docker compose logs postgres
```

Open PostgreSQL shell:

```bash
docker compose exec postgres psql -U postgres -d url_shortener
```

Exit PostgreSQL:

```text
\q
```

---

# Useful PostgreSQL Commands

Show tables:

```sql
\dt
```

Describe URLs table:

```sql
\d urls
```

View all URLs:

```sql
SELECT * FROM urls;
```

View only selected columns:

```sql
SELECT id, original_url, short_code, click_count
FROM urls;
```

Delete one URL:

```sql
DELETE FROM urls
WHERE id = 1;
```

---

# HTTP Status Codes Used

```text
201 Created
→ Short URL successfully created

400 Bad Request
→ Missing or invalid URL

404 Not Found
→ Short code does not exist
```

---

# Main Concepts Learned

## Express

Used to create the API server.

```text
Request
↓
Express Route
↓
Logic
↓
Response
```

---

## req.body

Used to read data sent by the client.

```js
const { originalUrl } = req.body
```

---

## req.params

Used to read dynamic URL values.

```js
const { shortCode } = req.params
```

---

## PostgreSQL

Stores URL information permanently.

---

## pg

Allows JavaScript to communicate with PostgreSQL.

---

## Pool

Manages PostgreSQL database connections.

```js
const { Pool } = pg
```

---

## SQL INSERT

Creates data.

```sql
INSERT INTO urls ...
```

---

## SQL SELECT

Reads data.

```sql
SELECT * FROM urls ...
```

---

## SQL UPDATE

Updates data.

```sql
UPDATE urls ...
```

---

## Parameterized Query

Example:

```sql
WHERE short_code = $1
```

with:

```js
[shortCode]
```

This keeps user input separate from the SQL query itself.

---

## Redirect

Express redirects the browser using:

```js
res.redirect(url.original_url)
```

---

## Persistence

Data remains available after the server restarts because it is stored in PostgreSQL instead of a temporary JavaScript array.

---

# What I Learned

Through this project I practiced:

- Express.js
- REST API development
- PostgreSQL
- Docker
- Docker Compose
- Docker volumes
- Database persistence
- Environment variables
- PostgreSQL connection using `pg`
- SQL table creation
- SQL INSERT
- SQL SELECT
- SQL UPDATE
- Parameterized SQL queries
- Route parameters
- Request bodies
- URL validation
- Short code generation
- Redirect handling
- Click tracking
- HTTP status codes
- API testing with Postman
- Debugging Express routes

---

# Completion Checklist

```text
✅ Express server created
✅ PostgreSQL running in Docker
✅ Docker Compose configured
✅ Docker volume configured
✅ PostgreSQL connected to JavaScript
✅ urls table created
✅ POST /shorten works
✅ Missing URL returns 400
✅ Invalid URL returns 400
✅ Random short code generated
✅ URL stored in PostgreSQL
✅ GET /:shortCode works
✅ Short URL redirects correctly
✅ Unknown short code returns 404
✅ Click count increases
✅ GET /stats/:shortCode works
✅ Server restart keeps data
✅ Postman tests pass
```

---

# Future Improvements

Possible future improvements:

- Better short-code collision handling
- Custom short codes
- URL expiration
- Authentication
- User accounts
- Per-user short URLs
- QR code generation
- Analytics dashboard
- Rate limiting
- Automated tests
- Public deployment

---

# Run Project

Start PostgreSQL:

```bash
docker compose up -d
```

Start Express server:

```bash
bun run dev
```

API:

```text
http://localhost:3000
```

---

# Stop Project

Stop Express:

```text
Ctrl + C
```

Stop PostgreSQL:

```bash
docker compose down
```

---

# GitHub

Before pushing, make sure `.env` is ignored.

Check:

```bash
git status
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "feat: complete URL shortener API"
```

Push:

```bash
git push
```

---

# Project Status

**Project 07 — URL Shortener API ✅ Completed**

Built with:

```text
JavaScript
Bun
Express.js
PostgreSQL
Docker Compose
Postman
```