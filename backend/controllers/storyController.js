const Story = require("../models/story");
const User = require("../models/user");
const AppError = require("../utils/AppError");
const { v2: cloudinary } = require("cloudinary");

exports.groupedStories = async (req, res, next) => {
  try {
    const following = (await User.findById(req.user.id)).following;
    console.log(following);

    const stories = await Story.aggregate([
      {
        $match: {
          author: { $in: following },
          expiresAt: { $gt: new Date() },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$author",
          stories: { $push: "$$ROOT" },
          count: { $sum: 1 },
          latestCreatedAt: { $first: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      {
        $unwind: "$authorDetails",
      },
      {
        $project: {
          _id: 0,
          author: {
            id: "$authorDetails._id",
            name: "$authorDetails.name",
            username: "$authorDetails.username",
            profilePic: "$authorDetails.profilePic",
          },
          stories: 1,
          count: 1,
          latestCreatedAt: 1, // Include latestCreatedAt for sorting
        },
      },
      {
        $sort: { latestCreatedAt: -1 }, // Sort authors by latest story createdAt
      },
      {
        $project: {
          _id: 0,
          stories: 1,
          author: 1,
        },
      },
    ]);

    res.json(stories);
  } catch (error) {
    console.log(error);
    next(new AppError("An error occurred while fetching stories", 500));
  }
};
exports.addStory = async (req, res, next) => {
  try {
    let { media } = req.body;

    const uploadedResponse = await cloudinary.uploader.upload(media);
    media = uploadedResponse.secure_url;

    const story = await Story.create({
      author: req.user.id,
      media,
    });
    res.status(200).json({ message: "story added successfully", story });
  } catch (error) {
    console.log(error);
    next(new AppError("cannot add story"));
  }
};
exports.getStory = async (req, res, next) => {
  try {
    const story = await Story.findOne({
      _id: req.params.storyId,
      expiresAt: { $gt: Date.now() },
    });
    if (!story) {
      res.status(200).json({ message: "story is expired" });
    }
    res.status(200).json({ message: "story retrieved successfully", story });
  } catch (error) {
    console.log(error);

    next(new AppError("cannot add story"));
  }
};
exports.getStories = async (req, res, next) => {
  try {
    const user = (await User.findOne({ username: req.params.username })).id;
    const stories = await Story.find({
      author: user,
      expiresAt: { $gt: Date.now() },
    })
      .sort({ createdAt: 1 })
      .populate("author", "name username profilePic");
    if (stories.length > 0 && stories[0].author.id !== req.user.id) {
      stories.forEach((story) => (story.storyViews = undefined));
    }
    res.status(200).json({ stories });
  } catch (error) {
    console.log(error);
    next(new AppError("Error fetching stories", 500));
  }
};
exports.getStoryViews = async (req, res, next) => {
  try {
    const story = await Story.findById(req.params.storyId)
      .select("likes storyViews")
      .populate({
        path: "storyViews",
        select: "profilePic username",
      });
    console.log(story);
    res.json({ story });
  } catch (error) {
    next(new AppError("cannot get story views"));
  }
};
exports.likeUnlikeStory = async (req, res, next) => {
  try {
    const storyId = req.params.storyId;
    const story = await Story.findById(storyId);
    const isStoryLiked = story.likes.includes(req.user.id);
    if (!isStoryLiked) {
      await Story.findByIdAndUpdate(storyId, {
        $push: { likes: req.user._id },
      });
      res.status(200).json("story liked successfull");
    } else {
      await Story.findByIdAndUpdate(storyId, { $pull: { likes: req.user.id } });
      res.status(200).json("story unliked successfull");
    }
  } catch (error) {
    console.log(error);
    next(new AppError("cannot like unlike story"));
  }
};
