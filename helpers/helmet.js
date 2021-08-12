const helmet = require("helmet");

module.exports = app => {
  app.use(helmet());
  const urls = require("./sources");
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...urls.connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...urls.scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...urls.styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
          "'self'",
          "blob:",
          "data:",
          `https://res.cloudinary.com/${process.env.CLOUD_NAME}/`,
          "https://images.unsplash.com/",
        ],
        fontSrc: ["'self'", ...urls.fontSrcUrls],
      },
    })
  );
};
