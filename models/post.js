const mongoose = require("mongoose");
const { Schema } = mongoose;
const formatDate = require("../utils/handleDate");

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  content: { type: String, required: true, maxLength: 1000 },
  timestamp: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

PostSchema.virtual("humanDate").get(function () {
  const date = formatDate(this.timestamp);
  return date;
});

module.exports = mongoose.model("Post", PostSchema);
