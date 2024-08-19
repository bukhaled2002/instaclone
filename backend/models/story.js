const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    media: {
      type: String,
      required: true,
    },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    createdAt: {
      type: Date,
      default: new Date.now(),
    },
    expiresAt: {
      type: Date,
      default: Date.now() + 24 * 60 * 60 * 1000,
    },
    storyViews: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const Story = mongoose.model("Story", storySchema);
module.exports = Story;
