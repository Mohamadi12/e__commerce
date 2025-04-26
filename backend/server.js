import express from "express";
import dotenv from "dotenv";
import path from "path";
//routes importation
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentsRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

//Charge environment variables
dotenv.config();

//Initialization
const app = express();
//My port running
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

//parser json the body of the request
app.use(express.json({ limit: "10mb" })); // parse json from the request
app.use(cookieParser()); //parse cookies from the request

//routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/analytics", analyticsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  //Database connection
  connectDB();
});
