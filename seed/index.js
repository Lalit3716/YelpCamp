const mongoose = require("mongoose");
const Campground = require("../models/campgrounds");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("DATABASE CONNECTED!!");
});

const seedData = async function () {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    rand1000 = Math.floor(Math.random() * 1000);
    price = Math.floor(Math.random() * 50 + 10);
    const camp = new Campground({
      author: "60dd54001ddb40152005cbab",
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      geometry: {
        type: "Point",
        coordinates: [cities[rand1000].longitude, cities[rand1000].latitude],
      },
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse hic dolorem, harum vitae itaque distinctio repudiandae optio facilis soluta ut, earum voluptas explicabo deserunt velit alias doloribus similique asperiores. Culpa est doloribus esse labore sit id recusandae nulla, unde fugit.",
      price,
    });
    await camp.save();
  }
};

seedData().then(() => {
  db.close();
});
