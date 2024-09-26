const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { v2: cloudinary } = require("cloudinary");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const messageRoute = require("./routes/messageRoute");
const storyRoute = require("./routes/storyRoute");
const { app, server } = require("./socket/socket");
const errorHandler = require("./controllers/errorHandler");
dotenv.config();
const PORT = process.env.PORT || 3000;
const DB = process.env.MONGODB_URI;

// Middleware
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://instaclone-bxoe.onrender.com"],
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/story", storyRoute);

app.get("/", (req, res) => res.send("Hello World!"));
app.all("*", (req, res, next) => {
  next(new Error(`this url (${req.originalUrl}) || (${req.url}) is not valid`));
});

app.use(errorHandler);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(DB);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDb();

server.listen(PORT, () => console.log(`listening on port ${PORT}!`));
