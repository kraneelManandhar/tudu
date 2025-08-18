import express from "express";
const userLoginRouter = express.Router();
import { validateCredentials } from "../controllers/userLoginController.js";
import { verifyToken } from "../middlewares/auth.js";

userLoginRouter

  //Validate Password
  .post("/validateCredentials", validateCredentials)
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

export default userLoginRouter;