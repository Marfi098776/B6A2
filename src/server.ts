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
            type VARCHAR(20) NOT NULL CHECK(type IN ('car', 'bike', 'van', 'SUV')),
            registration_number VARCHAR(50) UNIQUE NOT NULL,
            daily_rent_price INT NOT NULL CHECK (daily_rent_price > 0),
            availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))
            )
            `);
    await pool.query(`
            CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
            total_price INT NOT NULL CHECK (total_price > 0),
            status VARCHAR(100) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned'))
            )
            `)
}

initDB()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello B6A2 World!')
})


// create users
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

app.put("/users/:id", async (req: Request, res: Response) => {
    const {name, email, password, phone, role} = req.body;
    try {
        const result = await pool.query(`UPDATE users SET name=$1, email=$2, password=$3, phone=$4, role=$5 WHERE id=$6 RETURNING *`, [name, email, password, phone, role, req.params.id]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "user not found"
            })
        }else{
            res.status(200).json({
                success: true,
                message: "user updated successfully",
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

app.delete("/users/:id", async (req: Request, res: Response) => {

    try {
        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "user not found"
            })
        }else{
            res.status(200).json({
                success: true,
                message: "user deleted successfully",
                data: result.rows,
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
})

// create vehicles
app.post("/vehicles", async (req: Request, res: Response) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    try {
        const result = await pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
        // console.log(result.rows[0]);
        res.status(201).json({
            success: false,
            message: "vehicles Inserted Successfully",
            data: result.rows[0],
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }


})

app.get("/vehicles", async (req: Request, res: Response) => {

    try {
        const result = await pool.query(`SELECT * FROM vehicles`);

        res.status(200).json({
            success: true,
            message: "vehicles fetched Successfully",
            data: result.rows,
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
})

app.get("/vehicles/:id", async (req: Request, res: Response) => {

    try {
        const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [req.params.id]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "vehicle not found"
            })
        }else{
            res.status(200).json({
                success: true,
                message: "vehicle fetched successfully",
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

app.put("/vehicles/:id", async (req: Request, res: Response) => {
    const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = req.body;
    try {
        const result = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.id]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "vehicle not found"
            })
        }else{
            res.status(200).json({
                success: true,
                message: "vehicle updated successfully",
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

app.delete("/vehicles/:id", async (req: Request, res: Response) => {

    try {
        const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [req.params.id]);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "vehicle not found"
            })
        }else{
            res.status(200).json({
                success: true,
                message: "vehicle deleted successfully",
                data: result.rows,
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
