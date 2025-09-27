require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./routes/index");
const seedAdmin = require("./config/seedAdmin");

const app = express();

const allowedOrigins = [
  "https://kia-project-eight.vercel.app",
  "http://localhost:3000"
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
app.use("/api", routes);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  console.log("✅ DB connected");
  await seedAdmin();

  app.listen(PORT, () => {
    console.log("🚀 Server running on port:", PORT);
  });
});
