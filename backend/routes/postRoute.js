const { Router } = require("express");
const { protect } = require("../controllers/authController");
const {
  getPostsOfUser,
  createPost,
  editPost,
  getPost,
  deletePost,
  getMyposts,
  likeUnlikePost,
  getNewsFeedPosts,
  saveUnsSavePost,
} = require("../controllers/postController");

const router = Router();

router.route("/newsfeed").get(protect, getNewsFeedPosts);
router.route("/getMyPosts").get(protect, getMyposts);
router.route("/user/:username").get(protect, getPostsOfUser);

// upload image to cloudinary

// get/post posts for specific user
router.route("/").post(protect, createPost);
// .get(protect, getPosts)
// get edit delete specific post
router.use("/:postId", protect);
router.route("/:postId").get(getPost).patch(editPost).delete(deletePost);

// like unlikepost
router.route("/:postId/like").post(protect, likeUnlikePost);
router.route("/:postId/save").post(protect, saveUnsSavePost);

module.exports = router;
