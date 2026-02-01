import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"
import productRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import coupanRoutes from "./routes/coupan.route.js"
import paymentRoutes from "./routes/payments.route.js"
import analyticsRoutes from "./routes/analytic.route.js"

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupans", coupanRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(5000, () =>{
    console.log("Server is running on http://localhost:" + PORT)

    connectDB();
});