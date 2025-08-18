import User from "../Model/userModel.js";
import schemaValidator from "../helper/validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const TOKEN_KEY = process.env.JWT_KEY || 1234567890;

const registerUser = async (req, res) => {
  const result = await schemaValidator.validateAsync(req.body);
  const emailRecord = await User.findOne({ email: result.email });
  const salt = await bcrypt.genSalt(15);

  if (emailRecord) {
    return res
      .status(403)
      .json({ success: false, message: `${result.email} already exists!!` });
  }
  const usernameRecord = await User.findOne({ username: result.username });

  if (usernameRecord) {
    return res
      .status(409)
      .json({ success: false, message: `${result.username} aready exists!!` });
  }
  result.emailToken = jwt.sign({ email: result.email }, TOKEN_KEY, {
    expiresIn: "2h",
  });

  result.password = await bcrypt.hash(result.password, salt);
  const userObj = new User({ ...result });

  const insertUser = await userObj.save();
  if (insertUser) {
    const accessToken = jwt.sign(
      { email: insertUser.email, id: insertUser._id },
      `${insertUser._id}+${TOKEN_KEY}`,
      { expiresIn: "1h" }
    );
    userObj.accessToken = accessToken;
    userObj.save();
    console.log(userObj);
    res.status(200).send(userObj);
  }
};

export { registerUser };