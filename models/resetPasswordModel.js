const { Schema, model } = require("mongoose");

const resetPasswordSchema = new Schema({
  id: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    required: false,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});
const ResetPasswordModel = model("resetPasswords", resetPasswordSchema);
module.exports = ResetPasswordModel;
