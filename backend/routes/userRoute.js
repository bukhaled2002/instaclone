const { Router } = require("express");
const {
  updateMe,
  getMe,
  followUnfollowUser,
} = require("../controllers/userController");
const { signup, signin, protect } = require("../controllers/authController");

// auth
const router = Router();
router.route("/signup").post(signup);
router.route("/signin").post(signin);
// user
router.route("/getMe").get(protect, getMe);
router.route("/updateMe").patch(protect, updateMe);
router.route("/followUnfollow/:id").post(protect, followUnfollowUser);

module.exports = router;
