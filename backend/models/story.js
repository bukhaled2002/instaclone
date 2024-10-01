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
    storyViews: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    expiresAt: {
      type: Date,
      default: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    active: {
      type: Boolean,
      default: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

storySchema.pre(/^find/, function (next) {
  this.where({ expiresAt: { $gt: Date.now() } });
  next();
});

const Story = mongoose.model("Story", storySchema);
// async function updateStoryStatus() {
//   const now = new Date();
//   await Story.updateMany(
//     { expiresAt: { $lt: now }, active: true },
//     { active: false, archived: true }
//   );
// }

// const intervalTime = 60 * 60 * 1000;
// setInterval(async () => {
//   try {
//     await updateStoryStatus();
//   } catch (error) {
//     console.error("Error in updating story status", error);
//   }
// }, intervalTime);
module.exports = Story;
