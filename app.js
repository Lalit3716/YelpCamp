if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const MongoDbStore = require("connect-mongo");
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
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const db_url = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(db_url, {
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
const secret = process.env.SECRET || "thisisasecret";
const sessionConfig = {
    name: "asdbhbcaskjdfuygshvbdashbysgx",
    secret: secret,
    // secure: true,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7,
    },
    store: MongoDbStore.create({
        mongoUrl: db_url,
        touchAfter: 24 * 3600,
    }),
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

// Setting Helmet
app.use(helmet());

const scriptSrcUrls = [
    "https://kit.fontawesome.com/",
    "https://fontawesome.com/kits",
    "https://use.fontawesome.com/",
    "https://fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://use.fontawesome.com/",
    "https://fontawesome.com",
    "https://cdn.jsdelivr.net",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://cdnjs.cloudflare.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const fontSrcUrls = [
    "https://cdnjs.cloudflare.com/",
    "https://use.fontawesome.com/",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUD_NAME}/`,
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// Other Configs For Our App
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(mongoSanitize());

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

    if (err.message.includes("Cast to ObjectId failed")) {
        req.flash("error", "Invalid Search ID!");
        res.redirect("/campgrounds/");
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

const port = process.env.PORT || 3000;
// Starting Up Server
app.listen(port, (req, res) => {
    console.log(`LISTENING ON PORT ${port}!`);
});
