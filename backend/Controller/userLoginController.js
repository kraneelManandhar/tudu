import User from "../Model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const TOKEN_KEY = process.env.JWT_KEY || 1234567890;

const validateCredentials = async (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username: username }, async (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ success: false, message: err });
    }
    const isPasswordValid = await bcrypt.compare(password, result.password);
    if (!isPasswordValid) {
      console.log(`The password you entered is not correct`);
      res.status(401).json({
        success: false,
        message: `The password you entered is in correct`,
      });
    }
    const loginToken = jwt.sign(
      { _id: result._id, username: result.username },
      TOKEN_KEY,
      { expiresIn: "20m" }
    );
    User.findByIdAndUpdate(
      result._id,
      { accessToken: loginToken },
      (err, result) => {
        if (err) res.status(200).json({ success: false, message: err });
        res
          .status(200)
          .json({ message: "Password Validated Successfully", result: result });
      }
    );
  });
};

export { validateCredentials };