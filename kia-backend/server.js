require('dotenv').config({ path: './.env.dev' });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const routes = require("./routes/index")

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

app.use(express.json());

app.use("/api", routes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server running on port:", PORT)
    })
})
