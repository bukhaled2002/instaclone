const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const { app } = require("./socket/socket");
dotenv.config();
const PORT = process.env.PORT || 3000;
const DB = process.env.MONGODB_URI;

// Middleware
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(DB);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDb();

app.use("/api/v1/user", userRoute);

app.get("/", (req, res) => res.send("Hello World!"));
app.all("*", (req, res, next) => {
  next(new Error(`this url (${req.originalUrl}) || (${req.url}) is not valid`));
});
app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
