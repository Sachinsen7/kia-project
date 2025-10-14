require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const connectDB = require("./config/db");
const routes = require("./routes/index");
const seedAdmin = require("./config/seedAdmin");
const visitRouter = require("./modules/websiteVisit/visit.routes");
const cookieParser = require("cookie-parser");
const cookieTracker = require("./middleware/cookieTracker");

const app = express();
app.use(cookieParser());

// Track visits for all requests
app.use(cookieTracker);

const allowedOrigins = [
  "https://kia-project-sigma.vercel.app",
  "http://localhost:3000",
  "https://www.kiagoef.com/",
  "216.198.79.1"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);
app.use("/api/visit", visitRouter);

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Maximum size is 100MB" });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files uploaded" });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Unexpected file field" });
    }
  }
  next(error);
});

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  console.log("✅ DB connected");
  await seedAdmin();

  app.listen(PORT, () => {
    console.log("🚀 Server running on port:", PORT);
  });
});
