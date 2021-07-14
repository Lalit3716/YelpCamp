if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const User = require("./models/users");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("DATABASE CONNECTED!!");
});

app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// Setting Up Session
const sessionConfig = {
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));

// Setting Up Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting Up flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// Other Configs For Our App
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route Handlers
app.get("/", (req, res) => {
    res.render("home");
});
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id", reviewRoutes);
app.use("/", userRoutes);

// Error handlers
app.all("*", (req, res, next) => {
    next(new expressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }

    if (err.message === "Unexpected field") {
        req.flash("error", "Sorry Cannot Upload More Than 3 Images");
        res.redirect("back");
    }

    if (err.message.includes("Invalid regular expression")) {
        req.flash("error", "Invalid Search");
        res.redirect("back");
    }
    res.status(err.statusCode).render("error", { err });
});

// Starting Up Server
app.listen(3000, (req, res) => {
    console.log("LISTENING ON PORT 3000!!!");
});
