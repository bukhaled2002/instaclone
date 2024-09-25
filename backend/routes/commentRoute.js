const { Router } = require("express");
const { protect } = require("../controllers/authController");
const {
  createComment,
  getComment,
  editComment,
  deleteComment,
  likeUnlikeComment,
} = require("../controllers/commentController");

const router = Router();
// get comments of specific post
// router.route("/getComment").get(protect,getComment);

// add comment for a post
router.route("/").post(protect, createComment);
// get edit delete specific comment
router.use("/:commentId", protect);
router
  .route("/:commentId")
  .get(getComment)
  .patch(editComment)
  .delete(deleteComment);

// like unlikecomment
router.route("/like/:commentId").post(protect, likeUnlikeComment);

module.exports = router;
