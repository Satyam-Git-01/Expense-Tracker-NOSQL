const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremiumUser: {
    type: Boolean,
    required: false,
    default: false,
  },
  totalExpenses: {
    type: Number,
    default: 0,
    required: false,
  },
});

const userModel = model("users", userSchema);
module.exports = userModel;
