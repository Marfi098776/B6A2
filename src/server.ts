import express, { Request, Response } from "express"
import { Pool } from "pg"

const app = express()
const port = 5000
app.use(express.json());

const pool = new Pool({
    connectionString: `postgresql://neondb_owner:npg_NMLRIHX8EPp4@ep-square-mode-ahd6rv3c-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
})

const initDB = async() => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(50) NOT NULL
        )
        `);
}

initDB()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.post("/", (req: Request, res: Response) => {
    console.log(req.body);

    res.status(201).json({
        success: true,
        message: "Api is working"
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
