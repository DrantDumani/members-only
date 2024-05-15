const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  content: { type: String, required: true, maxLength: 600 },
  timestamp: { type: Date, default: Date.now() },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

PostSchema.virtual("humanDate").get(function () {
  const date = new Date(this.timestamp);
  return date.toLocaleDateString();
});

module.exports = mongoose.model("Post", PostSchema);
