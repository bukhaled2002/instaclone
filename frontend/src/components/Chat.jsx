import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { MdInfoOutline } from "react-icons/md";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { FiHeart, FiImage } from "react-icons/fi";
import Message from "./Message";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import customFetch from "../utils/customFetch";
import { useSocket } from "../context/SocketContext";
function Chat({ messages, participant, setConversations }) {
  const { user } = useSelector((state) => state.user);
  const [messageContent, setMessageContent] = useState("");
  const [Messages, setMessages] = useState(messages);
  const { socket } = useSocket();
  const messageEndRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [Messages]);

  const currentConversation = messages.length && messages[0]?.conversationId;
  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      console.log(Messages[0].conversationId);
      if (newMessage.conversationId === currentConversation) {
        setMessages((prev) => [...prev, newMessage]);
        setConversations((prev) => {
          let newConv = prev.map((conversation) => {
            if (conversation.id === newMessage.conversationId) {
              return { ...conversation, lastMessage: newMessage };
            }
            return conversation;
          });
          return newConv;
        });
      }
    });
    return () => {
      socket.off("newMessages");
    };
  }, [socket, currentConversation, setMessages, setConversations]);

  useEffect(() => {
    const isLastMessageFromOthers =
      Messages.length > 0 && Messages[Messages.length - 1].sender !== user.id;
    console.log(isLastMessageFromOthers);
    if (isLastMessageFromOthers) {
      socket.emit("setMessageSeen", {
        conversationId: messages[0].conversationId,
        userId: Messages[Messages.length - 1].sender,
      });
    }
    socket.on("messageSeen", ({ conversationId }) => {
      setMessages((prev) => {
        const newMessages = prev.map((message) => {
          if (message.sender === user.id) {
            return { ...message, seen: true };
          }
          return message;
        });
        return newMessages;
      });
      console.log("last message", Messages[Messages.length - 1]);
    });
  }, [Messages, socket, user.id]);

  const handleSendMessage = async (e) => {
    setIsSending(true);
    e.preventDefault();
    console.log(participant);
    const response = await customFetch.post("/message/sendMessage", {
      reciepent: participant.id,
      text: messageContent,
    });
    console.log(response.data);
    setMessageContent("");
    setConversations((prev) => {
      let newConv = prev.map((conversation) => {
        console.log(conversation.id, response.data);

        if (conversation.id === response.data.conversationId) {
          return { ...conversation, lastMessage: response.data };
        }
        return conversation;
      });
      return newConv;
    });
    setMessages((prev) => [...prev, response.data]);
    setIsSending(false);
  };
  console.log(participant);
  return (
    <Flex bg={"gray"} w={"100%"} direction={"column"}>
      <Flex
        justifyContent={"space-between"}
        bg={"black"}
        p={"20px"}
        align={"center"}
        borderBottom={"solid gray 0.5px"}
      >
        <Flex align={"center"} gap={"20px"} flex={1}>
          <Avatar
            as={Link}
            to={`/profile/${participant.username}`}
            src={participant.profilePic}
          />
          <Text fontSize={"lg"} fontWeight={"semibold"}>
            {participant.name}
          </Text>
        </Flex>
        <Box display={"flex"}>
          <MdInfoOutline fontSize={"30px"} cursor={"pointer"} />
        </Box>
      </Flex>
      <Flex
        flex={1}
        bg={"black"}
        overflowY={"auto"}
        p={"20px"}
        flexDirection={"column"}
        gap={"10px"}
      >
        {Messages.map((message, i) => {
          const isMe = message.sender === user.id;

          return (
            <Flex
              direction={"column"}
              key={message.id}
              ref={i === messages.length - 1 ? messageEndRef : null}
            >
              <Message isMe={isMe} message={message} />
            </Flex>
          );
        })}
      </Flex>
      <Flex
        as={"form"}
        onSubmit={handleSendMessage}
        w={"100%"}
        bg={"black"}
        borderTop={"solid gray 0.5px"}
        p={"10px"}
      >
        <Flex
          w={"90%"}
          borderRadius={"20px"}
          m={"auto"}
          py={"7px"}
          px={"15px"}
          gap={"10px"}
          border={"solid gray 0.5px"}
        >
          <MdOutlineEmojiEmotions fontSize={"25px"} />

          <Input
            h={"fit-content"}
            flex={1}
            placeholder="Message..."
            value={messageContent}
            disabled={isSending}
            onChange={(e) => setMessageContent(e.target.value)}
          ></Input>

          <FiImage fontSize={"25px"} />

          <FiHeart fontSize={"25px"} />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Chat;
