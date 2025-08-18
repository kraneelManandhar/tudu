const express = require("express");
const userLoginRouter = express.Router();
const userLoginController = require("../Controller/userLoginController.js");
const verifyToken = require("../middlewares/auth.js");

userLoginRouter

  //Validate Password
  .post("/validateCredentials", userLoginController.validateCredentials)
  .get("/validateCredentials", (req, res) => {
    res.status(405).json({ success: false, message: "Method not Allowed!!" });
  })
  .put("/validateCredentials", (req, res) => {
    res.status(405).json({ success: false, message: "Method not Allowed!!" });
  })
  .delete("/validateCredentials", (req, res) => {
    res.status(405).json({ success: false, message: "Method not Allowed!!" });
  })

  //Verify JWT
  .post("/", verifyToken)

  .get("/", (req, res) => {
    res.status(405).json({ success: false, message: "Method not Allowed!!" });
  })
  .put("/", (req, res) => {
    res.status(405).json({ success: false, message: "Method not Allowed!!" });
  })
  .delete("/", (req, res) => {
    res.status(405).json({ success: false, message: "Method not Allowed!!" });
  });

module.exports = userLoginRouter;