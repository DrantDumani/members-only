const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fName: { type: String, required: true, maxLength: 100 },
  lName: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true, minLength: 3, maxLength: 50 },
  email: { type: String, required: true, maxLength: 320 },
  password: { type: String, required: true },
  isMember: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
