require('dotenv').config({ path: './.env.dev' });
const express = require("express");
const connectDB = require("./config/db");

const routes = require("./routes/index")

const app = express();
app.use(express.json());

app.use("/api", routes);

const PORT = process.env.PORT||5000;

connectDB().then(() => {
    app.listen(PORT, () => {console.log("Server runnning on port:", PORT)})
})

