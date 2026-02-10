import express from "express"
import logger from "../../middleware/logger";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", logger, userController.createUser)

router.get("/", logger, auth("admin"), userController.getUser)

router.get("/:id", auth("admin", "user"), logger, userController.getSingleUser)

router.put("/:id", auth("admin", "user"), logger, userController.editUser)

router.delete("/:id", auth("admin"), logger, userController.deleteUser)

export const userRoutes = router;