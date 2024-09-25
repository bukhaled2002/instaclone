const { Router } = require("express");
const { protect } = require("../controllers/authController");
const {} = require("../controllers/commentController");
const {
  addStory,
  getStories,
  likeUnlikeStory,
  getStory,
  groupedStories,
  getStoryViews,
} = require("../controllers/storyController");

const router = Router();
router.route("/groupedStories").get(protect, groupedStories);
// get stories by username
router.route("/:username").get(protect, getStories);
router.route("/:storyId/views").get(protect, getStoryViews);
router.route("/getStory/:storyId").get(protect, getStory);
router.route("/addStory").post(protect, addStory);
router.route("/likeUnlikeStory/:storyId").post(protect, likeUnlikeStory);
module.exports = router;
