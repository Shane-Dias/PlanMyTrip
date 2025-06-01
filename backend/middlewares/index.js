require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

//API Routes
const analyzeAreaRoute = require("./routes/analyzeAreaRoute");
const { travelInfoController } = require("./controllers/travelInfoController");
const forecastRoutes = require("./routes/forecastRoutes");
const tweetRoutes = require("./routes/tweetRoute");
const incidentRoutes = require("./routes/incidents");
const safetyScoreRoutes = require("./routes/safetyScore");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: function (origin, callback) {
    const allowedPatterns = [
      /^http:\/\/localhost:5173$/,
      /^https:\/\/travel-safe-ai-jqdm.*vercel\.app$/,
    ];

    if (!origin || allowedPatterns.some((pattern) => pattern.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use('/uploads', express.static('uploads'));

// app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api", analyzeAreaRoute);
app.use("/api/travelInfo", travelInfoController);
app.use("/api/forecast", forecastRoutes);
app.use("/api", tweetRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api", safetyScoreRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
