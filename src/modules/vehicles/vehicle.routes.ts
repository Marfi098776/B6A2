import express from "express"
import logger from "../../middleware/logger";
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("admin"), logger, vehicleController.createVehicle)
router.get("/", logger, vehicleController.getVehicles)
router.get("/:id", logger, vehicleController.getSingleVehicle)
router.put("/:id", auth("admin"), logger, vehicleController.editVehicle)
router.delete("/:id", auth("admin"), logger, vehicleController.deleteVehicle)

export const vehicleRoutes = router;