import jwt from "jsonwebtoken";
import User from "../Model/userModel.js";

const TOKEN_KEY = process.env.JWT_KEY || 1234567890;

const verifyToken = (req, res, next) => {
  const { username } = req.body;
  const token = req.headers["access-token"];
  if (!token) {
    res
      .status(300)
      .json({ success: false, message: "No token entered in the header" });
  }
  User.find({ username: username }, (err, result) => {
    if (err) res.status(400).json({ success: false, message: err });
    if (result[0].accessToken != token) {
      console.log(`Token Not Verified!!`);
      res.status(401).json({ success: false, message: `Token Not Verified!!` });
    }
    if (result[0].accessToken == token) {
      try {
        const decoded = jwt.verify(token, TOKEN_KEY);
        res.status(200).json({ success: true, message: decoded });
      } catch (err) {
        res.status(400).json({ success: false, message: err });
      }
    }
    return next();
  });
};

export { verifyToken };