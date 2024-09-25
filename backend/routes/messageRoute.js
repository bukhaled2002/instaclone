const { Router } = require("express");
const { protect } = require("../controllers/authController");
const {} = require("../controllers/commentController");
const {
  sendMessage,
  getConversations,
  getMessages,
} = require("../controllers/messageController");

const router = Router();
router.route("/sendMessage").post(protect, sendMessage);
router.route("/:reciepentId/getMessages").get(protect, getMessages);
router.route("/getConversations").get(protect, getConversations);
module.exports = router;
