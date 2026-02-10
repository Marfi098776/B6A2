import express from "express"
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("admin", "user"), logger,);

router.get("/", auth("admin", "user"), logger, );

router.put("/", auth("admin", "user"), logger,);

export const bookingRoutes = router;