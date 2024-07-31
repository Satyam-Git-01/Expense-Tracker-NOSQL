const path = require("path");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/**
 *
 * @param {*} id Required
 * @param {*} email Not Required
 * @returns {*} A Token For User
 */
const generateAccessToken = (id, email) => {
  return jwt.sign({ userId: id }, process.env.JWT_TOKEN);
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description return the response of creation of user
 */
const handleSignUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10, async (err, hash) => {
      const result = await userModel.create({ name, email, password: hash });
      console.log(result);
      res
        .status(200)
        .send(
          `<script>alert('User Created Successfully!'); window.location.href='/'</script>`
        );
    });
  } catch (err) {
    await transaction.rollback();
    if (err.errors[0].type === "unique violation") {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists." });
    } else {
      return res.status(500).json({
        success: false,
        message: "Something Happend While Creating User",
      });
    }
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description Handles the Login of an user and return token to be used if successfull
 */
const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const users = await userModel.where("email").equals(email);
    const user = users[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(400)
          .json({ sucess: false, message: "Error Occured" });
      } else if (result == true) {
        return res.status(200).json({
          success: true,
          message: "Login Sucessfull",
          token: generateAccessToken(user.id, user.email),
        });
      } else {
        return res
          .status(400)
          .json({ sucess: false, message: "Incorrect Password" });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Can not login" });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description Serve the static login.html
 */
const handleLoginPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "login.html"));
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description Checks if the user is premium Member or not
 */
const isPremiumUser = async (req, res, next) => {
  try {
    const user = (await userModel.where("_id").equals(req.user._id)).at(0);
    if (user.isPremiumUser === true) {
      return res.status(200).send(user);
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = {
  handleSignUp,
  handleLoginPage,
  handleLogin,
  generateAccessToken,
  isPremiumUser,
};
