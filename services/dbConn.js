const Mongoose = require("mongoose");
const DBConn = async (url) => {
  try {
    const con = await Mongoose.connect(url);
    console.log("DB Connected SuccessFully");
  } catch (err) {
    console.log(err);
    //process.exit(1);
  }
};

module.exports= DBConn