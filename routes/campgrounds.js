const { storage } = require("../cloudinary_config");
const express = require("express");
const multer = require("multer");
const upload = multer({ storage });
const { isLoggedIn, isAuthor } = require("../utils/middlewares");
const { validateCampground } = require("../utils/validateData");
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds");
router = express.Router();

router.get("/", catchAsync(campgrounds.renderIndexPage));

router.get("/getAll", campgrounds.geoJsonCampgrounds);

router.get("/getOne/:id", campgrounds.geoJsonCampground);

router.get("/find/:title", campgrounds.checkCampgroundTitle);

router
  .route("/new")
  .get(isLoggedIn, campgrounds.renderNewForm)
  .post(
    isLoggedIn,
    upload.array("images", 3),
    validateCampground,
    campgrounds.makeNewCampground
  );

router.get("/:id", catchAsync(campgrounds.renderShowPage));

router
  .route("/:id/edit")
  .get(isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))
  .put(
    isLoggedIn,
    upload.array("images", 3),
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.editCampground)
  );

router.delete(
  "/:id/delete",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
