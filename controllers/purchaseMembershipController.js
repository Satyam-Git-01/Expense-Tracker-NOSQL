const Razorpay = require("razorpay");
const Order = require("../models/orderModel");
const { generateAccessToken } = require("./userController");

const purchasePremium = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 1000;
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        console.log(err);
        throw new Error(JSON.stringify(err));
      }
      await Order.create({orderid:order.id,status:"PENDING",userId:req.user._id})
      return res.status(201).json({ order, key_id: rzp.key_id });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ orderid: order_id });
    const promise1 = order.updateOne({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    });
    const promise2 = req.user.updateOne({ isPremiumUser: true });

    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(202).json({
          sucess: true,
          message: "Transaction Successful",
          token: generateAccessToken(userId, undefined, true),
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Sometghing went wrong" });
  }
};

module.exports = {
  purchasePremium,
  updateTransactionStatus,
};
