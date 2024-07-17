var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose"); // mongo db library
const connection = require("./config/database");
var passport = require("passport");

const session = require("express-session");
const MongoStore = require("connect-mongo"); // library to store session data in mongo

var indexRouter = require("./routes/indexRoutes");
var accountRouter = require("./routes/accountRoutes");
var dogamiRouter = require("./routes/dogamiRoutes");

// manage use of environment variables in the .env file
require("dotenv").config();

var app = express();

// Mongo string to be used for both data management and session storage
const mongoString = process.env.MONGO_STRING;

// Database connectivity
// dbConnect().catch((err) => console.log(err));
// async function dbConnect() {
//   await mongoose.connect(mongoString);
// }

/**
 * Session setup
 *
 * The session is the equivalent of a server-side cookie, storing information for the user session
 * Through the use of a database it has a greater capacity than a slient side cookie
 * It is used to assist authentication - ensuring password don't need to be used every request, etc.
 *
 * Process is:
 *  - user requests information from server
 *  - session is created, and session_id is passed to client in headers
 *  - session_id is stored in browser cookies
 *  - every subsequent request prior to expiry sends the session_id to ensure the requests are identified as within an existing session
 *
 * Note the session connection is separate form the connection used to generally interact with the application data
 * It is possible to use the same connection, would need to look into the details of how
 */

// https://www.npmjs.com/package/connect-mongo

// note this generates a session object, which is available to use through req.session after it is generated
// believe this is what passport uses for authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET, // used to sign the session ID cookie
    resave: false, // true forces the session to be saved to the session store even if the session is not modified
    saveUninitialized: true, // true forces the session to be saved to the session store if it is new but not modified
    store: MongoStore.create({
      mongoUrl: mongoString,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Expiry of 1 day
    },
  })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Need to require the entire Passport config module so app.js knows about it
require("./config/passport");

// express session middleware - gives us access to the request.session object
// allowing the session data to be persisted
// checks if req.session.passport.user isn't null, and if not, populates req.user using deserializeUser in /passport.js (from the db in this case)
app.use(passport.session());

// custom middleware to help understand passport
app.use((req, res, next) => {
  console.log("req.session", req.session);
  console.log("req.user from authentication process:", req.user);
  next();
});

// can create new properties to the application, and also specifically to the session
// check whether this is good practice
// app.use((req, res, next) => {
//   req.myNewThing = "apple";
//   req.session.niceSessionInfo = "banana";
//   next();
// });
// app.use((req, res, next) => {
//   console.log("req.myNewThing", req.myNewThing);
//   console.log("req.session.niceSessionInfo", req.session.niceSessionInfo);
//   next();
// });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use binds the middleware to an instance of the application object

// this middleware is what generates the "GET /login 200 2.513ms - 286" type outputs
app.use(logger("dev"));

// enable receiving json in the body of push and put requests
app.use(express.json());
// enable receiving strings or arrays in the body of push and put requests
app.use(express.urlencoded({ extended: false }));

// *** come back to this to make sure understand precise function ***
app.use(cookieParser());

// enables static files to be served (__dirname is the folder path of this file)
app.use(express.static(path.join(__dirname, "public")));

// mount the routers as middleware at the given locations
app.use("/", indexRouter);
app.use("/account", accountRouter);
app.use("/dogami", dogamiRouter);

// catch 404 and forward to error handler
// this seems to create an error with code 404, and passes it onto the next middleware
// seems sensible to have this at the end, with the error handler directly afterwards
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
