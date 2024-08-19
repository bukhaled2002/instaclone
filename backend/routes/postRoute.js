const { Router } = require("express");
const { protect } = require("../controllers/authController");

const router = Router();

// router.route("/newsfeed").get(protect, getnewsfeed);
// router.route("/getMyPosts").get(protect, getMyposts);

// get posts for specific user
// router.route("/").get(protect, getPosts);

// get edit delete specific post
// router.use('/:postId',protect)
// router.route("/:postId").get(getPost).patch(editPost).delete(deletePost)

// like unlikepost
// router.route("/like/postId").post(protect,likeUnlikePost)

module.exports = router;
