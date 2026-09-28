import express from "express"
import { pool } from "./db.js"

const app = express()

const PORT = 3000

app.use(express.json())


function generateShortCode() {
    return Math.random()
        .toString(36)
        .substring(2, 8)
}

app.post("/shorten", async (req, res) => {
    const { originalUrl } = req.body

    if (!originalUrl) {
        return res.status(400).json({
            message: "URL is required"
        })
    }

    try {
        new URL(originalUrl)
    } catch {
        return res.status(400).json({
            message: "Invalid URL"
        })
    }

    const shortCode = generateShortCode()

    const result = await pool.query(
        `
      INSERT INTO urls (original_url, short_code)
      VALUES ($1, $2)
      RETURNING *
    `,
        [originalUrl, shortCode]
    )

    const url = result.rows[0]

    res.status(201).json({
        id: url.id,
        originalUrl: url.original_url,
        shortCode: url.short_code,
        shortUrl: `http://localhost:${PORT}/${url.short_code}`
    })
});

app.get("/:shortCode", async (req, res) => {
    const { shortCode } = req.params

    console.log("Looking for:", shortCode)

    const result = await pool.query(
        `
      SELECT * FROM urls
      WHERE short_code = $1
    `,
        [shortCode]
    )

    const url = result.rows[0]

    if (!url) {
        return res.status(404).json({
            message: "Short URL not found"
        })
    }

    await pool.query(
        `
    UPDATE urls
    SET click_count = click_count + 1
    WHERE short_code = $1
  `,
        [shortCode]
    )

    res.redirect(url.original_url)
})

app.get("/stats/:shortCode", async (req, res) => {
    const { shortCode } = req.params

    const result = await pool.query(
        `
      SELECT id, original_url, short_code, click_count, created_at
      FROM urls
      WHERE short_code = $1
    `,
        [shortCode]
    )

    const url = result.rows[0]

    if (!url) {
        return res.status(404).json({
            message: "Short URL not found"
        })
    }

    res.json({
        id: url.id,
        originalUrl: url.original_url,
        shortCode: url.short_code,
        clickCount: url.click_count,
        createdAt: url.created_at
    })
})
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})