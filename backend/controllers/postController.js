const Post = require("../models/post");
const User = require("../models/user");
const { post } = require("../routes/userRoute");
const AppError = require("../utils/AppError");
const { v2: cloudinary } = require("cloudinary");
const { filterObj } = require("../utils/helper");

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).populate(
      "author",
      "username profilePic"
    );
    res.status(200).json({
      status: "success",
      message: "post retrieved successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("cannot get post", 404));
  }
};

exports.getPostsOfUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ author: user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: "posts retrieved successfully",
      data: { user, posts },
    });
  } catch (error) {
    console.log(error);
    next(new AppError("cannot get post", 404));
  }
};
exports.createPost = async (req, res, next) => {
  try {
    let { img, content } = req.body;
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }
    const post = await new Post({
      author: req.user.id,
      content,
      img,
    }).populate("author");
    await post.save();

    res.status(200).json({
      status: "success",
      message: "post added successfull",
      post,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("cannot add post", 404));
  }
};
exports.editPost = async (req, res, next) => {
  try {
    const filteredObject = filterObj(req.body, "comments", "likes", "author");
    const post = await Post.findOneAndUpdate(
      { _id: req.params.postId, author: req.user.id },
      filteredObject
    );

    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "not allowed to edit this post",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "post edited successfull",
      post,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("cannot edit post", 404));
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.postId,
      author: req.user.id,
    });

    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "not allowed to edit this post",
      });
    }
    res.status(200).json({
      status: "success",
      message: "post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    next(new AppError("cannot delete post", 404));
  }
};
exports.getNewsFeedPosts = async (req, res, next) => {
  try {
    const following = (await User.findById(req.user.id)).following;
    const posts = await Post.find({
      author: { $in: [...following, req.user.id] },
    })
      .sort({ createdAt: -1 })
      .populate("author", "username profilePic ");

    if (!posts) {
      next(new AppError("no posts found", 404));
    }

    res.status(200).json({
      status: "success",
      message: "posts retrieved successfull",
      posts,
    });
  } catch (error) {
    console.log(error);

    next(new AppError("cannot get posts of this user", 404));
  }
};
exports.getMyposts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user.id }).populate("author");
    if (!posts) {
      next(new AppError("cannot get posts", 404));
    }
    res.status(200).json({
      status: "success",
      message: "posts retrieved successfull",
      posts,
    });
  } catch (error) {
    console.log(error);
    next(new AppError("cannot get posts", 404));
  }
};

exports.likeUnlikePost = async (req, res, next) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  const isLiked = post.likes.includes(req.user.id);
  if (!isLiked) {
    await Post.findByIdAndUpdate(postId, { $push: { likes: req.user.id } });
    res.status(200).json({
      status: "success",
      message: "posts liked successfully",
    });
  } else {
    await Post.findByIdAndUpdate(postId, { $pull: { likes: req.user.id } });
    res.status(200).json({
      status: "success",
      message: "posts unliked successfully",
    });
  }
};
exports.saveUnsSavePost = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const isSaved = user.saved.includes(req.params.postId);
  if (isSaved) {
    user.saved = user.saved.filter((id) => id.toString() !== req.params.postId);

    await user.save();
    res.status(200).json({ message: "post unsaved successfully", user });
  } else {
    user.saved.push(req.params.postId);
    await user.save();
    res.status(200).json({ message: "post saved successfully", user });
  }
};
