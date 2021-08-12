const Campground = require("../models/campgrounds");
const { cloudinary } = require("../configs/cloudinary_config");
const moment = require("moment");
const mbxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxgeocoding({ accessToken: process.env.MAPBOX_TOKEN });

module.exports.geoJsonCampgrounds = async (req, res) => {
  res.json({ features: await Campground.find({}) });
};

module.exports.geoJsonCampground = async (req, res) => {
  res.json(await Campground.findById(req.params.id).lean());
};

module.exports.checkCampgroundTitle = async (req, res) => {
  const { title } = req.params;
  const campground = await Campground.findOne({ title }).lean();
  if (campground) {
    res.json({ found: true });
  } else {
    res.json({ found: false });
  }
};

module.exports.renderIndexPage = async (req, res) => {
  let campgrounds;
  let totalDocs;
  const search = req.query.search || "";
  let sortby = req.query.sort || "";
  const perPage = 9;
  const pageNumber = req.query.pageNumber || 1;

  if (!search) {
    totalDocs = await Campground.countDocuments({});
  }
  if (search) {
    campgrounds = await Campground.find({
      $or: [
        {
          title: new RegExp(`(\w*)${search}(\w*)`, "i"),
        },
        { location: new RegExp(`(\w*)${search}(\w*)`, "i") },
      ],
    })
      .sort(sortby)
      .skip(perPage * (pageNumber - 1))
      .limit(9);
    totalDocs = await Campground.countDocuments({
      $or: [
        {
          title: new RegExp(`(\w*)${search}(\w*)`, "i"),
        },
        { location: new RegExp(`(\w*)${search}(\w*)`, "i") },
      ],
    });
  } else {
    campgrounds = await Campground.find({})
      .sort(sortby)
      .skip(perPage * (pageNumber - 1))
      .limit(9);
  }

  let totalPages = totalDocs / perPage;

  if (totalPages % 1 !== 0) {
    totalPages = Math.floor(totalPages) + 1;
  }

  res.render("campgrounds/index", {
    campgrounds,
    searchTerm: search,
    totalDocs,
    sortby,
    totalPages,
    currentPage: pageNumber,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.makeNewCampground = async (req, res) => {
  const images = req.files.map(f => {
    return { path: f.path, filename: f.filename };
  });

  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  if (!geoData.body.features[0]) {
    req.flash("error", "Invalid Location Please Check Your Location.");
    return res.redirect("/campgrounds/new");
  }

  req.body.campground.geometry = geoData.body.features[0].geometry;
  const campground = new Campground(req.body.campground);
  campground.dateCreated = moment().format("MMM Do YY");
  campground.author = req.user._id;
  campground.images = images;
  await campground.save();
  req.flash("success", "Campground Created Successfully!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Campground Not Found!");
    return res.redirect("/campgrounds/");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.editCampground = async (req, res) => {
  const deleteImages = req.body.deleteImages;

  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  if (!geoData.body.features[0]) {
    req.flash("error", "Invalid Location Please Check Your Location.");
    return res.redirect(`/campgrounds/${req.params.id}/edit`);
  }

  req.body.campground.geometry = geoData.body.features[0].geometry;
  const campground = await Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    { runValidators: true }
  );

  if (deleteImages && deleteImages.length > 0) {
    await campground.updateOne({
      $pull: { images: { filename: { $in: deleteImages } } },
    });
    for (let img of deleteImages) {
      await cloudinary.uploader.destroy(img);
    }
  }

  images = req.files.map(f => {
    return { path: f.path, filename: f.filename };
  });

  campground.editDate = moment().format("MMM Do YY");
  campground.images.push(...images);
  await campground.save();
  req.flash("success", "Campground Updated Successfully!");
  res.redirect(`/campgrounds/${req.params.id}`);
};

module.exports.renderShowPage = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  if (!campground) {
    req.flash("error", "Campground Not Found!");
    return res.redirect("/campgrounds/");
  }

  res.render("campgrounds/show", { campground });
};

module.exports.deleteCampground = async (req, res) => {
  const campground = await Campground.findByIdAndDelete(req.params.id);
  for (let img of campground.images) {
    await cloudinary.uploader.destroy(img.filename);
  }
  req.flash("success", "Campground Deleted Successfully!");
  res.redirect("/campgrounds/");
};
