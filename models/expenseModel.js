const { Schema, model } = require("mongoose");
const expenseSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

const expenseModel = model("expenses", expenseSchema);
module.exports = expenseModel;
