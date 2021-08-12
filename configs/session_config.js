const MongoDbStore = require("connect-mongo");
const secret = process.env.SECRET || "thisisasecret";
const { db_url } = require("./db_config");
const sessionConfig = {
  name: "asdbhbcaskjdfuygshvbdashbysgx",
  secret: secret,
  secure: true,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: Date.now() + 1000 * 60 * 60 * 24 * 3,
  },
  store: MongoDbStore.create({
    mongoUrl: db_url,
    touchAfter: 24 * 3600,
  }),
};

module.exports.sessionConfig = sessionConfig;
