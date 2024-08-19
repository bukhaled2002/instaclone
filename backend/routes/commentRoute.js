const { Router } = require("express");
const { protect } = require("../controllers/authController");

const router = Router();
// get comments of specific comment
// router.route("/getComment").get(protect,getComment);

// get edit delete specific comment
// router.use('/:commentId',protect)
// router.route("/:commentId").get(getComment).patch(editComment).delete(deleteComment)

// like unlikecomment
// router.route("/like/commentId").comment(protect,likeUnlikeComment)

module.exports = router;
