const { io, getRecipientSocketId } = require("../socket/socket");
const Conversation = require("../models/conversation");
const Message = require("../models/message");
const AppError = require("../utils/AppError");

exports.sendMessage = async (req, res, next) => {
  try {
    const reciepentId = req.body.reciepent;
    const senderId = req.user.id;
    const text = req.body.text;

    if (!reciepentId) {
      res.status(400).json({ message: "cannot send message" });
    }
    if (reciepentId === senderId) {
      res.status(400).json({ message: "cannot send message to your self" });
    }
    let conversation;
    conversation = await Conversation.findOne({
      participants: { $all: [reciepentId, senderId] },
    });
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, reciepentId],
      });
      await conversation.save();
    }
    const lastMessage = new Message({
      conversationId: conversation.id,
      sender: senderId,
      text,
      img: "",
    });
    await Promise.all([
      lastMessage.save(),
      conversation.updateOne({ lastMessage: lastMessage.id }),
    ]);

    const recipientSocketId = getRecipientSocketId(reciepentId);
    console.log(recipientSocketId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", lastMessage);
    }
    res.status(201).json(lastMessage);
  } catch (error) {
    next(new AppError("cannot send messages", 404));
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const reciepentId = req.params.reciepentId;
    if (!reciepentId) {
      return res.status(400).json({ message: "cannot find message" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciepentId] },
    }).populate("participants", "name username profilePic");

    if (!conversation) {
      conversation = await new Conversation({
        participants: [reciepentId, senderId],
      }).populate("participants", "name username profilePic");
    }

    console.log(conversation);
    const messages = await Message.find({
      conversationId: conversation.id,
    }).sort({ createdAt: 1 });
    console.log(messages);
    let participant = conversation.participants.filter(
      (participant) => participant._id.toString() !== senderId
    )[0];
    res
      .status(200)
      .json({ status: "success", data: { participant, messages } });
  } catch (error) {
    next(new AppError("cannot find messages", 404));
  }
};
exports.getConversations = async (req, res, next) => {
  try {
    let conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate({ path: "lastMessage", select: "text sender createdAt seen" })
      .populate({ path: "participants", select: "name profilePic" })
      .sort({ updatedAt: -1 });

    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => {
          return participant._id.toString() !== req.user.id;
        }
      );
    });
    res.status(200).json({ status: "success", conversations });
  } catch (error) {
    console.log(error);
    next(new AppError("cannot get conversations", 404));
  }
};
