const mongoose = require("mongoose");
const db_url = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const db = mongoose.connection;
module.exports = {
  db,
  db_url,
};
