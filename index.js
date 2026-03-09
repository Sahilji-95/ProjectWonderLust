if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./router/listings.js");
const reviewRouter = require("./router/reviews.js");
const userRouter = require("./router/user.js");

const dburl = process.env.MONGO_URL;

async function main() {
  await mongoose.connect(dburl);
}
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRTE,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
  console.log("MongoStore error", err);
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRTE,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
  res.render("listing/home.ejs");
});

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong" } = err;
  res.status(status).render("listing/error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
