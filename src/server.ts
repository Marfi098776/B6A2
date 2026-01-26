import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs"

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const port = 5000;
app.use(express.json());

const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STR}`
})

const initDB = async () => {
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
    await pool.query(`
            CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            type VARCHAR(200),
            registration_number INT UNIQUE NOT NULL,
            daily_rent_price INT NOT NULL,
            availability_status VARCHAR(100) NOT NULL
            )
            `);
    await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price INT NOT NULL,
            status VARCHAR(100)
            )
            `)
}

initDB()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello B6A2 World!')
})

app.post("/users", async (req: Request, res: Response) => {
    const { name, email, password, phone, role } = req.body;

    const hashedPass = await bcrypt.hash(password as string, 10)

    try {
        const result = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, email, hashedPass, phone, role]);
        // console.log(result.rows[0]);
        res.status(201).json({
            success: false,
            message: "Data Inserted Successfully",
            data: result.rows[0],
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }


})

app.get("/users", async (req: Request, res: Response) => {

    try {
        const result = await pool.query(`SELECT * FROM users`);

        res.status(200).json({
            success: true,
            message: "users fetched Successfully",
            data: result.rows,
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

app.get("/users/:id", async (req: Request, res: Response) => {

    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found"
            })
        }else{
            res.status(200).json({
                success: true,
                message: "user fetched successfully",
                data: result.rows[0],
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
