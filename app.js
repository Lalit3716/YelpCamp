if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

// Database
const { db } = require('./configs/db_config');
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
  console.log('DATABASE CONNECTED!!');
});

// Initialise App
app = express();

// Configs For Our App
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(mongoSanitize());
app.locals.moment = require('moment');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

// Setting Up Session
const { sessionConfig } = require('./configs/session_config');
app.use(session(sessionConfig));

// Setting Up Passport
require('./helpers/passport')(app);

// Setting Up flash
require('./helpers/flash')(app);

// Setting Helmet
require('./helpers/helmet')(app);

// Route Handlers
app.get('/', (req, res) => res.render('home'));
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id', reviewRoutes);
app.use('/', userRoutes);

// Error handlers
require('./routes/errors')(app);

// Starting Up Server
const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log(`LISTENING ON PORT ${port}!`);
});
