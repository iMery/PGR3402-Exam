const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Za-z]+$/,
  }, //i want usernames to only have letters
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});
//pre save hook to avoid saving incorrect data
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
//Using a compare mthod to compare entered password with stored hash password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("User", userSchema);
