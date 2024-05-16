const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  content: { type: String, required: true, maxLength: 1000 },
  timestamp: { type: Number, default: Date.now() },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

PostSchema.virtual("humanDate").get(function () {
  const date = new Date(this.timestamp);
  return date.toLocaleDateString();
});

module.exports = mongoose.model("Post", PostSchema);
