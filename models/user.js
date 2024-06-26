const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: { type: String, required: true, minLength: 3, maxLength: 40 },
  email: { type: String, required: true, maxLength: 320 },
  password: { type: String, required: true },
  isMember: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

UserSchema.virtual("status").get(function () {
  if (this.isAdmin) return "Administrator";
  else if (this.isMember) return "Member";
  else return "User";
});

UserSchema.pre("save", async function (next) {
  const hashPw = await bcrypt.hash(this.password, 10);
  this.password = hashPw;
});

module.exports = mongoose.model("User", UserSchema);
