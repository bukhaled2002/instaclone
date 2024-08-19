const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.ObjectId,
      ref: "Conversation",
    },
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
    img: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
