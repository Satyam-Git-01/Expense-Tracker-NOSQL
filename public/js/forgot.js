const resetBtn = document.getElementById('resetbtn')
async function forgotPasswordSendMail(event) {
  event.preventDefault();
  try {
    const email = event.target.email.value;
    const result = await axios.post(
      "https://expense-tracker-nosql.vercel.app/password/sendResetPasswordMail",
      { email }
    );
    alert('Email has been Sent to your email id please check spam folder too.')
  } catch (err) {
    console.log(err);
  }
}
