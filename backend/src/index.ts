import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./routes/auth.routes";
import rideRoutes from "./routes/ride.routes";
import driverRoutes from "./routes/driver.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect DB
connectDB();

// Middleware
const allowedOrigins = [
    process.env.CLIENT_URL || "http://localhost:5173",
    "https://ridelink-gold.vercel.app",
    "http://localhost:5173"
];
app.use(cors({ 
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }, 
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/driver", driverRoutes);

// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "RideLink API running 🚗" });
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`🚀 RideLink server running on http://localhost:${PORT}`);
});

export default app;