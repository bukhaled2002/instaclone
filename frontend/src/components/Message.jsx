import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { IoCheckmark } from "react-icons/io5";
import { IoCheckmarkDone } from "react-icons/io5";
function Message({ message, isMe }) {
  return (
    <Flex
      bg={isMe ? "brand.secondary" : "gray"}
      minW={"100px"}
      maxW={{ base: "unset", md: "65%" }}
      p={"5px"}
      px={"10px"}
      alignSelf={isMe ? "end" : "start"}
      borderRadius={"10px"}
      borderBottomRightRadius={isMe && "0"}
      borderBottomLeftRadius={!isMe && "0"}
      width={"fit-content"}
      position={"relative"}
      flexWrap={"nowrap"}
      paddingRight={isMe ? "25px" : "10px"}
    >
      <Text
        wordBreak="break-word" // Break long words if necessary
        whiteSpace="normal"
      >
        {message.text}
      </Text>
      {isMe && (
        <Text p={0} position={"absolute"} right={1} bottom={1}>
          {!message.seen ? <IoCheckmark /> : <IoCheckmarkDone />}
        </Text>
      )}
    </Flex>
  );
}

export default Message;
