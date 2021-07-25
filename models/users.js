const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportMongoose);

module.exports = mongoose.model("User", userSchema);
