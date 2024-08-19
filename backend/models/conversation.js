const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.ObjectId, ref: "User" }],

    lastMessage: { type: mongoose.Schema.ObjectId, ref: "Message" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
