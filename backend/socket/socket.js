const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const Message = require("../models/message");
const Story = require("../models/story");
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://instaclone-bxoe.onrender.com",
    methods: ["GET", "POST"],
  },
});
const userSocketMap = {};

exports.getRecipientSocketId = (recipientId) => userSocketMap[recipientId];
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  console.log("online", Object.keys(userSocketMap));
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("setMessageSeen", async ({ conversationId, userId }) => {
    try {
      console.log(conversationId);
      const messages = await Message.updateMany(
        {
          conversationId,
          seen: false,
        },
        { $set: { seen: true } }
      );
      io.to(userSocketMap[userId]).emit("messageSeen", { conversationId });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("setStorySeen", async ({ userId, storyId }) => {
    console.log(userId);
    console.log(storyId);

    const story = await Story.findById(storyId);
    if (!story.storyViews.includes(userId)) {
      story.storyViews.push(userId);
    }
    await story.save();
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

exports.server = server;
exports.io = io;
exports.app = app;
