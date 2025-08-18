const express = require("express");
const userRegisterController = require("../Controller/userRegisterController");
const userRegisterRouter = express.Router();

userRegisterRouter.post("/register", userRegisterController.registerUser);

module.exports = userRegisterRouter;