const express = require("express");
const path = require("node:path");
const dotenv = require("dotenv").config();
const DBConn = require("./services/dbConn");
const bodyParser = require("body-parser");
const app = express();

const PORT_NUMBER = process.env.PORT_NUMBER || 4300;

DBConn(process.env.DB_URL);

// //Importing Routes
 const userRoute = require("./routers/userRoute");
 const expenseRoute = require("./routers/expenseRoute");
 const purchaseRoute = require("./routers/purchaseRoute");
const premiumRoute = require("./routers/premiumRoute");
const passwordRoute = require("./routers/passwordRoute");

//Imports for Models
// const User = require("./models/userModel");
// const Expense = require("./models/expenseModel");
// const Order = require("./models/orderModel");
// const ResetPassword = require("./models/resetPasswordModel");
// const FileDownloaded = require("./models/fileDownloadedModel");

//Application Level Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

//Route Level Middlewares
app.use("/", userRoute);
app.use("/user", userRoute);
app.use("/expense", expenseRoute);
 app.use("/purchase", purchaseRoute);
app.use("/premium", premiumRoute);
app.use("/password", passwordRoute);


app.listen(5800,()=>{
    console.log("Server Started")
})
