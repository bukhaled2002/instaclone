const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
    img: {
      type: String,
      required: true,
    },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "comments",
    sort: { createdAt: 1 },
    populate: {
      path: "author",
      select: "username profilePic createdAt",
    },
  });
  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
