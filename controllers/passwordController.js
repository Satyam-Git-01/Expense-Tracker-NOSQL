const path = require("path");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const userModel = require("../models/userModel");
const ResetPasswordModel = require("../models/resetPasswordModel");

const hashedPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const getForgotPasswordPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "forgot.html"));
};

const sendMail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const resetId = uuidv4();
    const resetUser = await userModel.findOne({ where: { email: email } });
    if (!resetUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Exist! Try correct Email" });
    }
    const resetDataResult = await ResetPasswordModel.create({
      id: resetId,
      isActive: true,
      userId: resetUser.id,
    });
    //SIB Code
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    const transEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "satyamchoudhary680@gmail.com",
      name: "Satyam Choudhary",
    };
    const receivers = [
      {
        email: email,
      },
      //can add admin also
    ];
    await transEmailApi.sendTransacEmail({
      sender,
      To: receivers,
      subject: "Reset Password Expense Tracker APP",
      textContent: "link below",
      htmlContent: `<h4>Dear ${resetUser.name}</h4>
      <br/>
      <p>It seems you have forgotten your password. Please <a href="http://localhost:5800/password/resetPasswordPage/{{params.requestId}}"> Click Here</a> to reset your password. Your password should have 8 or more characters with at least one uppercase letter, lowercase letter, number and special character. Please note that this link will expire in 24 hours.</p>
    <br/>
        <p>Thanks & Best Regards,
        <br/>
        Satyam Choudhary</p>`,
      params: {
        requestId: resetId,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Link for reset the password is successfully send on your mail",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Error Occurred while resetting password",
    });
  }
};

const getresetPasswordPage = (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "../", "public", "views", "resetPassword.html")
  );
};

const updatePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const requestId = req.headers.referer.split("/").at(-1);
    const checkStatusOfRequest = await ResetPasswordModel.findOne({
      where: { id: requestId, isActive: true },
    });
    if (checkStatusOfRequest) {
      const userId = checkStatusOfRequest.userId;
       await ResetPasswordModel.update(
        { isActive: false },
        { where: { id: requestId } }
      );
      const newhashedPassword = await hashedPassword(newPassword);
      await userModel.update(
        {
          password: newhashedPassword,
        },
        {
          where: {
            id: userId,
          },
        }
      );
      return res
        .status(200)
        .json({ message: "Successfully changed password!" });
    } else {
      return res
        .status(400)
        .json({ message: "Link is already Used Once, Request for new Link!" });
    }
  } catch (err) {
    return res.status(400).json({ message: "Failed to change password!" });
  }
};

module.exports = {
  getForgotPasswordPage,
  sendMail,
  getresetPasswordPage,
  updatePassword,
};
