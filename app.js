require("dotenv/config");

const express = require("express");
const path = require("path");
const passport = require("passport");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const homeRouter = require("./routes/index");
const checkPincode = require("./middlewares/checkPincode");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Google Auth
app.use(passport.initialize());

app.use(checkPincode);

app.use("/", homeRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at http://localhost:${PORT}`);
});
