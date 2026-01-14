const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
require("dotenv").config();
require("./db/conn");

// --- EXISTING ROUTERS ---
const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const appointRouter = require("./routes/appointRoutes");
const notificationRouter = require("./routes/notificationRouter");

// --- NEW ROUTERS (AI & PAYMENT) ---
// Make sure you created these files in server/routes/ as discussed!
const aiRouter = require("./routes/aiRoutes");
const paymentRouter = require("./routes/paymentRoutes");

// Initialize Express App
const app = express();
const port = process.env.PORT || 5015;

// Middlewares
app.use(cors());
app.use(express.json());

// --- API ROUTES ---
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);

// --- NEW API ROUTES INJECTION ---
app.use("/api/ai", aiRouter);           // Endpoint: /api/ai/consult
app.use("/api/payment", paymentRouter); // Endpoint: /api/payment/create-checkout-session

// Serve React frontend from build folder
app.use(express.static(path.join(__dirname, "./client/build")));

// Handle unknown API routes (404)
app.use("/api", (req, res) => {
  res.status(404).send("API route not found");
});

// Serve React frontend (catch-all for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO
const setupSocket = require("./controllers/socket");
setupSocket(server);

// Start Server
server.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});