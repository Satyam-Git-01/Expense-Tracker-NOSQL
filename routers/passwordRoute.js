const express = require("express");
const {
  getForgotPasswordPage,
  sendMail,
  getresetPasswordPage,
  updatePassword,
} = require("../controllers/passwordController");

const passwordRoute = express.Router();

passwordRoute.get("/forgotPasswordPage", getForgotPasswordPage);
passwordRoute.post("/sendResetPasswordMail", sendMail);
passwordRoute.get("/resetPasswordPage/:id", getresetPasswordPage);
passwordRoute.post("/updatePassword", updatePassword);

module.exports = passwordRoute;
