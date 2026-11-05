import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Doctor Tracker API running on port ${PORT} [${NODE_ENV}]`);
    console.log(`Health Check: http://localhost:${PORT}/api/v1/health`);
  });

  // Graceful shutdown handling
  const shutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down server gracefully...`);
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startServer();
