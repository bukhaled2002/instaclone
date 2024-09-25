import { Avatar, Box, Flex, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { useSelector } from "react-redux";
import customFetch from "../utils/customFetch";
import { Link } from "react-router-dom";
function Comment({
  author,
  content,
  commentId = "",
  date,
  order,
  likes,
  isPostPublisher = false,
}) {
  const { user } = useSelector((state) => state.user);
  const [Likes, setLikes] = useState(likes);
  const [isLiked, setIsLiked] = useState(Likes.includes(user.id));
  const toast = useToast();
  const handleLikeUnlikeComment = async () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setLikes([...Likes, user.id]);
      toast({ title: "Post liked successfully", status: "success" });
    } else {
      let l = Likes.filter((l) => {
        return l !== user.id;
      });
      setLikes(l);
      toast({ title: "Post unliked successfully", status: "success" });
    }
    const response = await customFetch.post(`/comment/like/${commentId}`);
  };
  console.log(Likes);
  return (
    <Flex
      justify={"space-between"}
      p={"10px"}
      gap={"10px"}
      order={order || undefined}
    >
      <Link to={`/profile/${author.id}`} relative={"path"}>
        <Avatar src={author.profilePic} />
      </Link>
      <Box flex={1} fontWeight={200}>
        <Flex
          direction={"column"}
          style={{
            fontWeight: "700",
            paddingRight: "5px",
          }}
        >
          <Link to={`/profile/${author.id}`} relative={"path"}>
            {author.username}
          </Link>
          <Text textColor={"gray"} fontSize={"13px"} fontWeight={400}>
            {date}
          </Text>
        </Flex>
        <pre>{content}</pre>
      </Box>
      {!isPostPublisher && (
        <Box
          cursor={"pointer"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          onClick={handleLikeUnlikeComment}
        >
          {isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
          <Text color={"gray"} fontSize={"14px"}>
            {Likes.length} likes
          </Text>
        </Box>
      )}
    </Flex>
  );
}

export default Comment;
