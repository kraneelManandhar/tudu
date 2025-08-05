const express = require("express");
const path = require("path");
const app = express();
const port = 5000;
const mongoose = require('mongoose')

require('dotenv').config();
const TaskRoute = require('./Routes/TaskRoute');

app.use(express.json());

app.use("/static",express.static(path.join(__dirname,'../frontend')))

console.log(process.env.MONGODB_URL);

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("Connected to database.");
})
.catch((err) => {
  console.log("Couldn't connect", err.message);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use("/static", express.static(path.join(__dirname, "../frontend")));
app.use("/api/tasks",TaskRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});