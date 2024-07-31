const express = require("express");
const { handleSignUp ,handleLoginPage,handleLogin,isPremiumUser} = require("../controllers/userController");
const authenticatemiddleware = require("../middlewares/auth");
const userRoute = express.Router();

userRoute.get('/',handleLoginPage)
userRoute.post("/signUp", handleSignUp);
userRoute.post("/login",handleLogin)
userRoute.get("/isPremiumUser",authenticatemiddleware,isPremiumUser)

module.exports = userRoute
