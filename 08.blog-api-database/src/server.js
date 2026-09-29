import express, { json } from "express";

import { pool } from "./db.js"

const app = express()

const PORT = 3000

app.use(express.json())

app.get("/", (req, res) => {
    res.json({
        message: "Blog API is running"
    })
})

app.post("/categories", async (req, res) => {
    const { name } = req.body

    if (!name || name.trim() === "") {
        return res.status(400).json({
            message: "Category name is required"
        })
    }

    try {

        const result = await pool.query(
            `
            INSERT INTO categories (name)
            VALUES ($1)
            RETURNING * `
            ,
            [name.trim()]
        )

        res.status(201), json(result.rows[0])
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Category already exists"
            })
        }
        console.log(error)

        res.status(500).json({
            Message: "Internal server error"
        })
    }

})


app.get("/categories", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM categories ORDER BY id ASC`
        )

        res.json(result.rows)
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.patch("/categories/:id", async (req, res) => {
    const id = Number(req.params.id)
    const { name } = req.body

    if (!name || name.trim() === "") {
        return res.status(400).json({
            message: "Category name is required"
        })
    }

    try {
        const result = await pool.query(
            `
            UPDATE categories SET name = $1 WHERE id = $2 RETURNING  * `,
            [name.trim(), id]
        )

        const category = result.rows[0]
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        res.json(category)

    } catch (error) {
        if (error.code === "23503") {
            return res.status(409).json({
                message: "Cannot delete category because it has posts"
            })
        }

        console.log(error)

        res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.delete("/categories/:id", async (req, res) => {
    const id = Number(req.params.id)

    try {
        const result = await pool.query(
            `
            DELETE FROM categories WHERE id = $1 RETURNING * `,
            [id]
        )

        const category = result.rows[0]

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        res.json({
            message: "Category deleted successfully",
            category
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal server error"
        })

    }
})

app.post("/posts", async (req, res) => {
    const { title, content, categoryId } = req.body

    if (!title || title.trim() === "" || !content || content.trim() === "" || !categoryId) {
        return res.status(400).json({
            message: "Title , content and categoryId are required"
        })
    }

    try {
        const result = await pool.query(
            `
            INSERT INTO posts(title , content , category_id)
            VALUES ($1, $2 , $3)
            RETURNING * `,
            [title.trim(), content.trim(), categoryId]
        )

        res.status(201).json(result.rows[0])
    } catch (error) {
        if (error.code === "23503") {
            return res.status(400).json({
                message: "Category does not exist"
            })
        }

        console.log(error)

        res.status(500).json({
            message: "Internal server error"
        })
    }
})


app.get("/posts", async (req, res) => {

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 5
    const search = req.query.search || ""

    const offset = (page - 1) * limit

    try {
        const countResult = await pool.query(
            `
            SELECT COUNT(*) 
            FROM posts
            WHERE
              title ILIKE $1
              OR content ILIKE $1
          `,
            [`%${search}%`]
        )
        const total = Number(countResult.rows[0].count)
        const result = await pool.query(
            `SELECT
            posts.id,
            posts.title,
            posts.content,
            posts.category_id,
            posts.created_at,
            categories.name AS category_name
            FROM posts
            JOIN categories
            ON posts.category_id = categories.id
            WHERE
            posts.title ILIKE $1
            OR posts.content ILIKE $1
            ORDER BY posts.id ASC 
            LIMIT $2
            OFFSET $3  `,
            [`%${search}%`, limit, offset]
        )
        res.json({
            page,
            limit,
            total,
            posts: result.rows
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Internal server error"
        })

    }
})

app.get("/posts/:id", async (req, res) => {
    const id = Number(req.params.id)

    try {
        const result = await pool.query(
            `
            SELECT
            posts.id,
            posts.title,
            posts.content,
            posts.category_id,
            posts.created_at,
            categories.name AS category_name
            FROM posts 
            JOIN categories
            ON posts.category_id = categories.id
            WHERE posts.id = $1`,
            [id]
        )
        const post = result.rows[0]

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }
        res.json(post)
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.patch("/posts/:id", async (req, res) => {
    const id = Number(req.params.id)
    const { title, content, categoryId } = req.body

    try {
        const existingPost = await pool.query(
            `SELECT * FROM posts WHERE id = $1`,
            [id]
        )

        const post = existingPost.rows[0]

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }

        const updatedTitle = title !== undefined ? title.trim() : post.title

        const updatedContent = content !== undefined ? content.trim() : post.title

        const updatedCategoryId = categoryId !== undefined ? categoryId : post.category_id

        if (updatedTitle === "" || updatedContent === "") {
            return res.status(400).json({
                message: "Title and content cannot be empty"
            })
        }

        const result = await pool.query(
            `
            UPDATE posts 
            SET title = $1,
            content = $2,
            category_id = $3
            WHERE id = $4
            RETURNING * `,
            [
                updatedTitle,
                updatedContent,
                updatedCategoryId,
                id
            ]
        )

        res.json(result.rows[0])
    } catch (error) {
        if (error.code === "23503") {
            return res.status(400).json({
                message: "Category does not exist"
            })
        }

        console.log(error)

        res.status(500).json({
            message: "Internal server error"
        })
    }
})

app.delete("/posts/:id", async (req, res) => {
    const id = Number(req.params.id)

    try {
        const result = await pool.query(
            `
        DELETE FROM posts
        WHERE id = $1
        RETURNING *
      `,
            [id]
        )

        const post = result.rows[0]

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            })
        }

        res.json({
            message: "Post deleted successfully",
            post
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Internal server error"
        })
    }
})


app.use((req, res) => {
    res.status(404).json({
        message: "NOT found"
    })
})
app.listen(PORT, () => {
    console.log(`server running on http:localhost:${PORT}`)

})