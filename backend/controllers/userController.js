const User = require("../models/user");
const AppError = require("../utils/AppError");
const { filterObj } = require("../utils/helper");
const { v2: cloudinary } = require("cloudinary");

exports.getUsers = async (req, res, next) => {
  console.log(req.query.searchParam);

  try {
    const searchParam = req.query.searchParam;

    // Use regex to match the first characters
    const users = await User.find({
      $or: [
        { email: { $regex: `^${searchParam}`, $options: "i" } }, // Case-insensitive match
        { name: { $regex: `^${searchParam}`, $options: "i" } },
        { username: { $regex: `^${searchParam}`, $options: "i" } },
      ],
    }).select("name username profilePic");

    res.status(200).json(users);
  } catch (error) {}
};
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    res.status(200).json({
      status: "success",
      message: "profile retrieved successful",
      user,
    });
  } catch (error) {
    next(new AppError("cannot get profile", 404));
  }
};
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: "success",
      message: "profile retrieved successful",
      user,
    });
  } catch (error) {
    next(new AppError("cannot get profile", 404));
  }
};
exports.updateMe = async (req, res, next) => {
  try {
    let profilePic = req.body.profilePic;
    if (profilePic) {
      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }
    const filteredObject = filterObj(
      req.body,
      "profilePic",
      "following",
      "followers"
    );
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
      ...filteredObject,
      profilePic,
    });
    res.status(200).json({
      status: "success",
      message: "profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);

    next(new AppError("cannot update profile", 404));
  }
};

exports.followUnfollowUser = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);
    console.log(currentUser, targetUser);
    if (!currentUser || !targetUser) {
      next(new AppError("no user found", 404));
    }
    if (currentUser.id === targetUser.id) {
      next(new AppError("cannot follow your self"));
    }
    const isFollowed = currentUser.following.includes(targetUser.id);
    console.log(isFollowed);
    if (isFollowed) {
      await User.findByIdAndUpdate(currentUser.id, {
        $pull: { following: targetUser.id },
      });
      await User.findByIdAndUpdate(targetUser.id, {
        $pull: { followers: currentUser.id },
      });
      res.status(200).json({ message: "user unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(currentUser.id, {
        $push: { following: targetUser.id },
      });
      await User.findByIdAndUpdate(targetUser.id, {
        $push: { followers: currentUser.id },
      });
      res.status(200).json({ message: "user followed successfully" });
    }
  } catch (error) {
    console.log(error);
    next(new AppError("cannnot change following list"));
  }
};

exports.getFollowers = async (req, res, next) => {
  try {
    const { followers } = await User.findById(req.params.userId).populate({
      path: "followers",
      select: "username profilePic",
    });
    console.log(followers);

    res
      .status(200)
      .json({ message: "user followers retrieved successfully", followers });
  } catch (error) {
    console.log(error);
    next(new AppError("cannnot get followers list"));
  }
};
exports.getFollowing = async (req, res, next) => {
  try {
    const { following } = await User.findById(req.params.userId).populate({
      path: "following",
      select: "username profilePic",
    });
    console.log(following);

    res
      .status(200)
      .json({ message: "user followers retrieved successfully", following });
  } catch (error) {
    console.log(error);
    next(new AppError("cannnot get followers list"));
  }
};

exports.suggestFriends = async (req, res, next) => {
  try {
    const following = (await User.findById(req.user.id)).following;
    const suggestions = await User.aggregate([
      { $match: { _id: { $ne: [req.user.id, ...following] } } },
      { $sample: { size: 5 } },
    ]);
    res.status(200).json({
      message: "user suggestions retrieved successfully",
      suggestions,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("cannnot get suggestion list"));
  }
};
