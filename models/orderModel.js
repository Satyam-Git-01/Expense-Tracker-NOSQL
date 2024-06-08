const { Schema, model } = require("mongoose");
const orderSchema = new Schema({
  paymentid: {
    type: String,
    required: false,
  },
  orderid: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

const OrderModel = model("orders", orderSchema);
module.exports = OrderModel;
