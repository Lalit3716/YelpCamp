const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: Number,
  body: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
