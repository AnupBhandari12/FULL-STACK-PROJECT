import pg from "pg"

const { Pool } = pg

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

pool .query("SELECT NOW()").then ((result) => {
  console.log("Database connected" , result.rows[0])
})
.catch((error) => {
  console.log("Database connections failed : " , error.message);
})
