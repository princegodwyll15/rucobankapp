// ***********************************
// all required files go here
// ***********************************

const express = require("express");
const static = require("./routes/static");
require("dotenv").config();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const app = express();
const mongoose = require("./database/database");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const generalRoute = require("./routes/generalRoute");
const session = require("express-session");

// ***********************************
// session setup
// ***********************************
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yourSecretKey", // required for security
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    cookie: { secure: false, maxAge: 120000 }, // configure cookie (secure: true for HTTPS)
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  res.locals.success = req.session.success;
  res.locals.danger = req.session.danger;

  delete req.session.message; // Clear the message after passing it to locals
  delete req.session.success; // Clear the message after passing it to locals
  delete req.session.danger; // Clear the message after passing it to locals

  next();
});

// ***********************************
// view engine and ejs template setup
// ***********************************
app.set("view engine", "ejs");
app.use(expressLayout);
app.set("layout", "./layout/layout");

// ***********************************
// manage user and admmin images
// ***********************************
app.use("/uploads", express.static("uploads"));

// ***********************************
// express should pass json and body of a form
// ***********************************
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ***********************************
// all routes go here
// ***********************************
app.use(static);
app.use(adminRoute);
app.use(userRoute);
app.use(generalRoute);

//index route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
  });
});

// ***********************************
// port and server message
// ***********************************
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("App is running and server is listining on " + PORT);
});
