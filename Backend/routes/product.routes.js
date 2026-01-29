import express from "express"
import { getAllProducts,getFeaturedProducts,getRecommendedProducts,createProduct, deleteProduct, getProductByCategory, toggleFeatureProduct } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router  = express.Router();

router.get("/",protectRoute,adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);
router.get("/category/:category", getProductByCategory);
router.post("/", protectRoute,adminRoute,createProduct);
router.patch("/",protectRoute, adminRoute, toggleFeatureProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router