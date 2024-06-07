const { Schema, model } = require("mongoose");
const userSchema = new Schema({});

const userModel = model("users", userSchema);
module.exports = userModel;
