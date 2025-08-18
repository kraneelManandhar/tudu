const express = require("express");
const path = require("path");
const app = express();
const mongoose = require('mongoose')

require('dotenv').config();
const port = process.env.port;
const TaskRoute = require('./Routes/TaskRoute');
const categoryRouter = require('./Routes/categoryRouter')
const userRegisterRoute =  require("./Routes/userRegisterRoute");


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

app.use("/api/tasks/cat",categoryRouter);

app.use((req,res)=>{
  res.status(401).json({message:'invaid route'})
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});