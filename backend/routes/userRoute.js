const { Router } = require("express");
const {
  updateMe,
  getMe,
  followUnfollowUser,
  getFollowers,
  getUser,
  getUsers,
  getFollowing,
  suggestFriends,
} = require("../controllers/userController");
const { signup, signin, protect } = require("../controllers/authController");

// auth
const router = Router();
router.route("/signup").post(signup);
router.route("/signin").post(signin);
// user
router.route("/getMe").get(protect, getMe);
// search users
router.route("/").get(protect, getUsers);

router.route("/updateMe").patch(protect, updateMe);
router.route("/followUnfollow/:id").post(protect, followUnfollowUser);
router.route("/:userId/followers").get(protect, getFollowers);
router.route("/:userId/following").get(protect, getFollowing);
router.route("/suggestFriends").get(protect, suggestFriends);
router.route("/:username").get(protect, getUser);

module.exports = router;
