import express from "express"
import bcrypt from "bcryptjs"
import { pool } from "./db.js"
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middleware/auth.js"

const app = express()

const PORT = 3000

app.use(express.json())

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required"
    })
  }

  try {
    const existingUser = await pool.query(
      `
        SELECT id
        FROM users
        WHERE email = $1
      `,
      [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email already registered"
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
      `,
      [
        name.trim(),
        email.trim().toLowerCase(),
        passwordHash
      ]
    )

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0]
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Internal server error"
    })
  }
})

app.post("/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    })
  }

  try {
    const result = await pool.query(
      `
        SELECT *
        FROM users
        WHERE email = $1
      `,
      [email.trim().toLowerCase()]
    )

    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }
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

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Internal server error"
    })
  }
})

app.get("/profile" , authMiddleware, async (req , res) => {
    console.log("Decoded user:", req.user)

  try {
    const result = await pool.query(
      `
      SELECT id , name , email , created_at
      FROM users
      WHERE id = $1`
    ,
    [req.user.userId]
    )

        console.log("Profile result:", result.rows)


    const user = result.rows[0]

    if(!user){
      return res.status(404).json({
        message : "User not found"
      })
    }

    res.json({
      user
    })
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message : "Internal server error"
    })
    
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})