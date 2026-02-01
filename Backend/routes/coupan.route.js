import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import {getCoupan, validateCoupan} from "../controllers/coupan.controller.js"

const router = express.Router();
 router.get("/", protectRoute, getCoupan);
 router.get("/validate",protectRoute, validateCoupan);

export default router