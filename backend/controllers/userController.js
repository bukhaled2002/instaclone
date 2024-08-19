const User = require("../models/user");
const AppError = require("../utils/AppError");

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
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body);
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
    if (!currentUser || !targetUser) {
      next(new AppError("no user found", 404));
    }
    if (currentUser.id === targetUser.id) {
      next(new AppError("cannot follow your self"));
    }
    const isFollowed = currentUser.following.includes(targetUser.id);
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
