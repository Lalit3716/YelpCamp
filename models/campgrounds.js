const mongoose = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  path: String,
  filename: String,
});

imageSchema.virtual("thumb").get(function () {
  return this.path.replace("/upload", "/upload/h_277,w_415");
});

imageSchema.virtual("deletethumb").get(function () {
  return this.path.replace("/upload", "/upload/h_130,w_160,r_20");
});

const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema(
  {
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    avg_rating: {
      type: Number,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    images: [imageSchema],
    dateCreated: {
      type: String,
    },
    editDate: {
      type: String,
    },
  },
  opts
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<a href="/campgrounds/${this._id}">${this.title}</a>
          <br>
          <i class="fas fa-map-marker-alt text-info"></i><span>  ${this.location}</span>
          <br>
          <i class="fas fa-star popUpStar"></i><span> ${this.avg_rating}</span>
          <p><b>Price:$${this.price}/night</b></p>`;
});

campgroundSchema.post("findOneAndDelete", async doc => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
