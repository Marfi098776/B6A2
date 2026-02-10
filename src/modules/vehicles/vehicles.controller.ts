import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.services";

const createVehicle = async (req: Request, res: Response) => {
    
    try {
        const result = await vehicleServices.createVehicle(req.body);
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


}

const getVehicles = async(req: Request, res: Response) => {

    try {
        const result = await vehicleServices.getVehicles();

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
}

const getSingleVehicle = async(req: Request, res: Response) => {

    try {
        const result = await vehicleServices.getSingleVehicle(req.params.id as string)

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
}

const editVehicle = async (req: Request, res: Response) => {
    const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = req.body;
    try {
        const result = await vehicleServices.editVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.id as string)

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
}

const deleteVehicle = async (req: Request, res: Response) => {

    try {
        const result = await vehicleServices.deleteVehicle(req.params.id as string);

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
}


export const vehicleController = {
    createVehicle,
    getVehicles,
    getSingleVehicle,
    editVehicle,
    deleteVehicle
}