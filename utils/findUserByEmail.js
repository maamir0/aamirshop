const AppError = require("./appError");

async function findUserByEmail(User, email, phone, selectedFields, next) {
  if (!email && !phone) {
    return next(new AppError(400, "please enter email or phone"));
  }
  const user = await User.findOne({ email }).select(selectedFields).exec();
  if (!user) return next(new AppError(404, "Invalid Credentials"));
  return user;
}

module.exports = {
  findUserByEmail,
};
