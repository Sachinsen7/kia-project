require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./routes/index");
const seedAdmin = require("./config/seedAdmin");

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
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
