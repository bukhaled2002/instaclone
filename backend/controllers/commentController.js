const Comment = require("../models/comment");
const AppError = require("../utils/AppError");
const { filterObj } = require("../utils/helper");

exports.createComment = async (req, res, next) => {
  try {
    const filteredObject = filterObj(req.body, "likes", "author");
    const comment = await new Comment({
      ...filteredObject,
      author: req.user.id,
    }).populate("author", "username profilePic");

    await comment.save();
    res.status(200).json({
      status: "success",
      message: "comment added successfull",
      comment,
    });
  } catch (error) {
    console.log(error);

    next(new AppError("cannot add comment", 404));
  }
};

exports.getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    res.status(200).json({
      status: "success",
      message: "comment retrieved successfull",
      comment,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("comment not found", 404));
  }
};
exports.editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.commentId, {
      content: req.body.content,
    });

    res.status(200).json({
      status: "success",
      message: "comment edited successfull",
      comment,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("cannot edit comment", 404));
  }
};
exports.deleteComment = async (req, res, next) => {
  try {
    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({
      status: "success",
      message: "comment deleted successfull",
    });
  } catch (error) {
    console.log(error);
    next(new AppError("cannot delete comment", 404));
  }
};

exports.likeUnlikeComment = async (req, res, next) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  const isLiked = comment.likes.includes(req.user.id);
  if (!isLiked) {
    await Comment.findByIdAndUpdate(commentId, {
      $push: { likes: req.user.id },
    });
    res.status(200).json({
      status: "success",
      message: "comment liked successfully",
    });
  } else {
    await Comment.findByIdAndUpdate(commentId, {
      $pull: { likes: req.user.id },
    });
    res.status(200).json({
      status: "success",
      message: "comment unliked successfully",
    });
  }
};
