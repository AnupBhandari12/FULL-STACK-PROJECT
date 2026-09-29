# Blog API with PostgreSQL

A RESTful Blog API built with Express.js, PostgreSQL, Docker Compose, Bun, and JavaScript.

This project supports category and post management with relational database design, validation, foreign-key protection, search, pagination, and structured API responses.

---

## Features

- Category CRUD
- Post CRUD
- PostgreSQL database
- Docker Compose setup
- SQL migrations
- Category/Post relationship
- Foreign key constraints
- Request validation
- Duplicate category handling
- Invalid category handling
- Search posts by title/content
- Pagination
- Stable ordering
- Total result count
- SQL JOIN for category names
- Proper HTTP status codes
- Postman API testing

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
Postman / Client
      ↓
Express API
      ↓
Validation
      ↓
SQL Query
      ↓
PostgreSQL
      ↓
JOIN / CRUD / Search / Pagination
      ↓
JSON Response
```

---

## Project Structure

```text
08.blog-api-database/
│
├── src/
│   ├── server.js
│   └── db.js
│
├── migrations/
│   └── 001-initial.sql
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
cd 08.blog-api-database
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
  "name": "08.blog-api-database",
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

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=blog_api
```

Do not commit `.env`.

Add this to `.gitignore`:

```text
node_modules
.env
```

---

# Docker Compose

Create a `compose.yml` file:

```yaml
services:
  postgres:
    image: postgres:16

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: blog_api

    ports:
      - "5433:5432"

    volumes:
      - blog_api_data:/var/lib/postgresql/data

volumes:
  blog_api_data:
```

Start PostgreSQL:

```bash
docker compose up -d
```

Check service:

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
migrations/001-initial.sql
```

Contents:

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
);
```

Run migration in PowerShell:

```powershell
Get-Content migrations\001-initial.sql | docker compose exec -T postgres psql -U postgres -d blog_api
```

---

# Database Structure

## categories

```text
id
name
```

Example:

```text
1 → JavaScript
2 → React
```

## posts

```text
id
title
content
category_id
created_at
```

Example:

```text
1
JavaScript Basics
Learning variables and functions
1
2026-09-29 ...
```

---

# Relationship

```text
categories.id
      ↑
      │
posts.category_id
```

This means every post must reference a valid category.

Example:

```text
category id 1 exists
↓
post category_id = 1
↓
valid
```

Invalid:

```text
category id 999 does not exist
↓
post category_id = 999
↓
foreign key error
```

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
    console.log("Database connected", result.rows[0])
  })
  .catch((error) => {
    console.log("Database connection failed", error.message)
  })
```

---

# API Endpoints

# Categories

## Create Category

```http
POST /categories
```

Example:

```text
http://localhost:3000/categories
```

Body:

```json
{
  "name": "JavaScript"
}
```

Success:

```json
{
  "id": 1,
  "name": "JavaScript"
}
```

Status:

```text
201 Created
```

---

## Duplicate Category

If the same category already exists:

```json
{
  "message": "Category already exists"
}
```

Status:

```text
409 Conflict
```

PostgreSQL error code used:

```text
23505
```

Meaning:

```text
unique_violation
```

---

## Get Categories

```http
GET /categories
```

Example response:

```json
[
  {
    "id": 1,
    "name": "JavaScript"
  },
  {
    "id": 2,
    "name": "React"
  }
]
```

---

## Update Category

```http
PATCH /categories/:id
```

Example:

```text
PATCH /categories/2
```

Body:

```json
{
  "name": "React JS"
}
```

Success:

```json
{
  "id": 2,
  "name": "React JS"
}
```

---

## Category Not Found

```json
{
  "message": "Category not found"
}
```

Status:

```text
404 Not Found
```

---

## Delete Category

```http
DELETE /categories/:id
```

Example:

```text
DELETE /categories/2
```

Success:

```json
{
  "message": "Category deleted successfully",
  "category": {
    "id": 2,
    "name": "React JS"
  }
}
```

---

## Category With Existing Posts

If a category is still used by posts, PostgreSQL prevents deletion.

Response:

```json
{
  "message": "Cannot delete category because it has posts"
}
```

Status:

```text
409 Conflict
```

PostgreSQL code:

```text
23503
```

Meaning:

```text
foreign_key_violation
```

---

# Posts

## Create Post

```http
POST /posts
```

Body:

```json
{
  "title": "JavaScript Basics",
  "content": "Learning variables and functions.",
  "categoryId": 1
}
```

Success:

```json
{
  "id": 1,
  "title": "JavaScript Basics",
  "content": "Learning variables and functions.",
  "category_id": 1,
  "created_at": "..."
}
```

Status:

```text
201 Created
```

---

## Post Validation

If required fields are missing:

```json
{
  "message": "Title, content and categoryId are required"
}
```

Status:

```text
400 Bad Request
```

---

## Invalid Category

Request:

```json
{
  "title": "Test Post",
  "content": "Hello",
  "categoryId": 999
}
```

Response:

```json
{
  "message": "Category does not exist"
}
```

Status:

```text
400 Bad Request
```

---

## Get All Posts

```http
GET /posts
```

The API joins posts with categories.

Example result:

```json
{
  "page": 1,
  "limit": 5,
  "total": 2,
  "posts": [
    {
      "id": 1,
      "title": "JavaScript Basics",
      "content": "Learning variables and functions.",
      "category_id": 1,
      "created_at": "...",
      "category_name": "JavaScript"
    }
  ]
}
```

---

# SQL JOIN

The API uses:

```sql
JOIN categories
ON posts.category_id = categories.id
```

Flow:

```text
posts.category_id
↓
categories.id
↓
category name
↓
combined response
```

---

## Get One Post

```http
GET /posts/:id
```

Example:

```text
GET /posts/1
```

Success:

```json
{
  "id": 1,
  "title": "JavaScript Basics",
  "content": "Learning variables and functions.",
  "category_id": 1,
  "created_at": "...",
  "category_name": "JavaScript"
}
```

If post does not exist:

```json
{
  "message": "Post not found"
}
```

Status:

```text
404 Not Found
```

---

## Update Post

```http
PATCH /posts/:id
```

Example:

```text
PATCH /posts/1
```

Body:

```json
{
  "title": "Advanced JavaScript"
}
```

PATCH updates only fields that were sent.

Example logic:

```text
title sent
→ update title

content not sent
→ keep old content

categoryId not sent
→ keep old category
```

Invalid category:

```json
{
  "message": "Category does not exist"
}
```

---

## Delete Post

```http
DELETE /posts/:id
```

Success:

```json
{
  "message": "Post deleted successfully",
  "post": {
    "id": 1,
    "title": "Advanced JavaScript",
    "content": "Learning variables and functions.",
    "category_id": 1,
    "created_at": "..."
  }
}
```

If post is missing:

```json
{
  "message": "Post not found"
}
```

---

# Search

Posts can be searched using:

```text
GET /posts?search=javascript
```

The API searches:

```text
title
content
```

SQL:

```sql
WHERE
  posts.title ILIKE $1
  OR posts.content ILIKE $1
```

`ILIKE` performs case-insensitive search.

Example:

```text
javascript
JavaScript
JAVASCRIPT
```

can all match.

---

# Pagination

Example:

```text
GET /posts?page=1&limit=2
```

Query parameters:

```text
page
limit
```

Formula:

```text
offset = (page - 1) * limit
```

Examples:

```text
page 1, limit 2
→ offset 0

page 2, limit 2
→ offset 2

page 3, limit 2
→ offset 4
```

SQL:

```sql
ORDER BY posts.id ASC
LIMIT $2
OFFSET $3
```

Stable ordering is provided with:

```sql
ORDER BY posts.id ASC
```

---

# Search + Pagination Together

Example:

```text
GET /posts?search=javascript&page=1&limit=2
```

Flow:

```text
search query
↓
COUNT matching posts
↓
LIMIT
↓
OFFSET
↓
return current page
```

---

# Total Count

The API uses:

```sql
SELECT COUNT(*)
FROM posts
WHERE
  title ILIKE $1
  OR content ILIKE $1;
```

The result is returned as:

```json
{
  "page": 1,
  "limit": 2,
  "total": 5,
  "posts": []
}
```

---

# Parameterized Queries

The project uses placeholders:

```sql
$1
$2
$3
```

Example:

```js
await pool.query(
  `
    INSERT INTO posts (title, content, category_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `,
  [title, content, categoryId]
)
```

This keeps input values separate from the SQL query.

---

# HTTP Status Codes Used

```text
200 OK
→ Successful read/update/delete

201 Created
→ Resource successfully created

400 Bad Request
→ Invalid or missing input

404 Not Found
→ Resource does not exist

409 Conflict
→ Duplicate value or foreign-key delete conflict

500 Internal Server Error
→ Unexpected server/database error
```

---

# PostgreSQL Error Codes Used

```text
23505
→ unique_violation

23503
→ foreign_key_violation

42601
→ SQL syntax error
```

---

# Important Concepts Learned

## CRUD

```text
Create
Read
Update
Delete
```

---

## Migration

A migration stores database structure in a file.

Instead of manually remembering:

```sql
CREATE TABLE ...
```

the schema is saved in:

```text
migrations/001-initial.sql
```

Benefits:

```text
repeatable setup
version history
Git tracking
same schema on another machine
```

---

## Foreign Key

```text
posts.category_id
↓
categories.id
```

This protects relational integrity.

---

## JOIN

Used to combine data from related tables.

```text
posts
+
categories
↓
post with category name
```

---

## Pagination

Used to avoid returning every record at once.

```text
page
limit
offset
```

---

## Search

Uses PostgreSQL:

```sql
ILIKE
```

for case-insensitive matching.

---

## Validation

The API checks incoming input before saving data.

Example:

```text
empty category name
→ 400

missing post title
→ 400

invalid category
→ 400
```

---

# Postman Testing Checklist

```text
POST /categories
→ 201

POST duplicate category
→ 409

GET /categories
→ 200

PATCH /categories/:id
→ 200

PATCH missing category
→ 404

DELETE /categories/:id
→ 200

DELETE category with posts
→ 409

POST /posts
→ 201

POST /posts invalid category
→ 400

GET /posts
→ 200

GET /posts/:id
→ 200

GET missing post
→ 404

PATCH /posts/:id
→ 200

PATCH invalid category
→ 400

DELETE /posts/:id
→ 200

Search
→ works

Pagination
→ works

Search + pagination
→ works

Total count
→ works
```

---

# Useful Docker Commands

Start database:

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

Open PostgreSQL shell:

```bash
docker compose exec postgres psql -U postgres -d blog_api
```

Exit:

```text
\q
```

---

# Useful PostgreSQL Commands

Show tables:

```sql
\dt
```

Describe category table:

```sql
\d categories
```

Describe post table:

```sql
\d posts
```

View categories:

```sql
SELECT * FROM categories;
```

View posts:

```sql
SELECT * FROM posts;
```

---

# What I Learned

Through this project I practiced:

- Express REST APIs
- PostgreSQL
- Docker Compose
- SQL migrations
- Relational database design
- Primary keys
- Foreign keys
- SQL INSERT
- SQL SELECT
- SQL UPDATE
- SQL DELETE
- SQL JOIN
- SQL COUNT
- SQL ILIKE
- LIMIT
- OFFSET
- Stable ordering
- Parameterized queries
- Request validation
- PostgreSQL error handling
- Pagination
- Search
- API response structure
- Postman testing
- Debugging SQL syntax errors

---

# Completion Checklist

```text
✅ Express server
✅ PostgreSQL database
✅ Docker Compose
✅ Migration file
✅ Categories table
✅ Posts table
✅ Foreign key relationship
✅ Category CRUD
✅ Post CRUD
✅ Validation
✅ Duplicate handling
✅ Foreign-key handling
✅ JOIN
✅ Search
✅ Pagination
✅ Stable ordering
✅ Total count
✅ Postman testing
```

---

# Future Improvements

Possible improvements:

- Authentication
- User ownership
- Draft/published state
- Sorting options
- Filter by category
- Automatic migration runner
- Automated tests
- Rate limiting
- Deployment
- OpenAPI / Swagger docs

---

# Run Project

Start PostgreSQL:

```bash
docker compose up -d
```

Start API:

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

# GitHub Push

Check files:

```bash
git status
```

Add:

```bash
git add .
```

Commit:

```bash
git commit -m "feat: complete blog API with PostgreSQL"
```

Push:

```bash
git push
```

---

# Project Status

**Project 08 — Blog API with Database Integration ✅ Completed**

Built with:

```text
JavaScript
Bun
Express.js
PostgreSQL
Docker Compose
Postman
```