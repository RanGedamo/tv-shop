require("dotenv").config();
require("./DB");

const cors = require("cors");
const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
// const session = require('express-session');

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//     session({
//       secret: 'your-secret-key', // החלף במפתח סודי משלך
//       resave: false,
//       saveUninitialized: true,
//     })
//   );



//Add main css file
app.use(express.static(__dirname + "/public"));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// views //
const { optionalAuth } = require('./middleware/auth');

const viewRoutes = require("./routes/viewRoutes");
app.use("/",optionalAuth, viewRoutes);
// views //

const productRoutes = require("./routes/productRoutes");
app.use("/products", productRoutes); // שים לב לשינוי אם הכוונה היא להתאים לנתיב הזה

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

const authRoutes = require("./routes/userRouters");
app.use("/auth", authRoutes);

app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
