const changePassword = async (event) => {
  event.preventDefault();
  try {
    const newPassword = event.target.newPassword.value;
    const result = await axios.post(
      "https://expense-tracker-nosql.vercel.app/password/updatePassword",
      {
        newPassword,
      }
    );
    window.location.href = "/";
    alert("Password Changed SuccessFully")
  } catch (err) {
    console.log(err);
  }
};
