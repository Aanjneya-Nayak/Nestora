if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbUrl = process.env.MONGO_URL;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const listingsrouter = require("./routes/listing");
const userrouter = require("./routes/user.js");
const reviewrouter = require("./routes/review.js");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

// ================= MIDDLEWARE SETUP (BEFORE ROUTES) =================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/demouser", async (req, res) => {
  let fakeuser = new User({
    email: "student1@gmail.com",
    username: "delta-student1",
  });
  let registeredUser = await User.register(fakeuser, "helloworld");
  res.send(registeredUser);
});

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connected to MongoDB");
}

app.get("/", (req, res) => {
  res.redirect("/listings");
});

//Listings routes
app.use("/listings", listingsrouter);

//Review routes
app.use("/listings/:id/reviews", reviewrouter);

//User routes
app.use("/", userrouter);

app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const status = err.status || 400;
  const message = err.message || "Something went wrong";

  res.status(status).render("error.ejs", { message, status });
});

const PORT = process.env.PORT || 8084;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
