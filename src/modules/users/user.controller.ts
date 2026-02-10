import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    
    try {
        const result = await userServices.createUser(req.body)
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
}

const getUser = async (req: Request, res: Response) => {

    try {
        const result = await userServices.getUser();

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
}

const getSingleUser = async (req: Request, res: Response) => {

    try {
        const result = await userServices.getSingleUser(req.params.id as string);

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
}

const editUser = async (req: Request, res: Response) => {
        const {name, email, password, phone, role} = req.body;

    try {
        const result = await userServices.editUser(name, email, password, phone, role, req.params.id as string)

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
}

const deleteUser = async (req: Request, res: Response) => {

    try {
        const result = await userServices.deleteUser(req.params.id as string);

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
}

export const userController = {
    createUser,
    getUser,
    getSingleUser,
    editUser,
    deleteUser
}