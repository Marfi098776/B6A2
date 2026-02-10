import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/users/user.routes";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";
import { authRoutes } from "./modules/auth/auth.routes";



const app = express();
const port = config.port;
app.use(express.json());

// initDB()

app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello B6A2 World!')
})


//users crud
app.use("/users", userRoutes)

//vehicles crud
app.use("/vehicles", vehicleRoutes)

// bookings crud
app.use("/bookings", bookingRoutes)

// auth Routes
app.use("/auth", authRoutes);

app.use((req, res)=> {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
