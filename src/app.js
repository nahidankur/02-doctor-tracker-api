import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { ApiError } from "./utils/apiError.js";

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = [process.env.CLIENT_ORIGIN];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, adjust as needed
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rate Limiting (e.g., max 300 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});
app.use("/api", limiter);

// Request Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Mount API v1
app.use("/api/v1", routes);

// Root path friendly response
app.get("/", (req, res) => {
  res.json({
    name: "Doctor Tracker API",
    version: "1.0.0",
    docs: "/api/v1/health",
  });
});

// 404 Handler
app.use((req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
});

// Centralized Global Error Handler
app.use(errorHandler);

export default app;
