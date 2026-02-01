import express from "express"
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticData, getDailySalesData } from "../controllers/analytic.controller.js";


const router = express.Router();

router.get("/", protectRoute, adminRoute, async(req, res) =>{
    try {
        const analyticData = await getAnalyticData();

        const endDate = new Date();
        const startDate = new Date(endDate.getTime()- 7 * 24 * 60 * 60 * 1000);

        const dailySalesData = await getDailySalesData(startDate,endDate);

        res.json({
            analyticData,
            dailySalesData,
        })

    } catch (error) {
        
    }
})

export default router;