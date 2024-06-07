const changePassword = async (event) => {
  event.preventDefault();
  try {
    const newPassword = event.target.newPassword.value;
    const result = await axios.post(
      "http://localhost:5800/password/updatePassword",
      {
        newPassword,
      }
    );
    window.location.href = "/";
  } catch (err) {
    console.log(err);
  }
};
