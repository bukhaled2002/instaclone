import React, { useState } from "react";
import { Avatar, Box, Flex, Skeleton, Text, useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegComment, FaRegBookmark } from "react-icons/fa6";
import { FaRegHeart, FaBookmark } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { getTimeDifference } from "../utils/timeCalculater";
import customFetch from "../utils/customFetch";
import { setPosts } from "../features/user/postsSlice";
import MenuComponent from "./MenuComponent";
import PostModal from "./PostModal"; // Import the PostModal component
import { Link } from "react-router-dom";

function Post({ post }) {
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const { content, author, id, comments, createdAt, img, likes } = post;
  const [isLiked, setIsLiked] = useState(likes.includes(user.id));
  const [isSaved, setIsSaved] = useState(
    user?.saved?.includes(post.id) || false
  );
  const [isLiking, setIsLiking] = useState(false);
  const [isOpenPostModal, setIsOpenPostModal] = useState(false); // State for modal
  const [selectedPostId, setSelectedPostId] = useState(null); // State for selected post ID
  const date = getTimeDifference(new Date(createdAt));
  const toast = useToast();
  const dispatch = useDispatch();

  const handleLikePost = async () => {
    try {
      setIsLiking(true);
      let updatedPost;
      setIsLiked(!isLiked);

      if (isLiked) {
        updatedPost = posts.map((p) => {
          if (p.id === post.id) {
            return {
              ...p,
              likes: p.likes.filter((i) => i !== user.id),
            };
          }
          return p;
        });
        toast({ status: "success", title: "Post unliked successfully" });
      } else {
        updatedPost = posts.map((p) => {
          if (p.id === post.id) {
            return { ...p, likes: [...p.likes, user.id] };
          }
          return p;
        });
        toast({ status: "success", title: "Post liked successfully" });
      }
      dispatch(setPosts(updatedPost));
      setIsLiking(false);
      await customFetch.post(`/post/${id}/like`);
    } catch (error) {
      console.log(error);
      toast({ title: "Cannot do this action", status: "error" });
      setIsLiking(false);
    }
  };

  const handleOpenModal = () => {
    setSelectedPostId(post.id);
    setIsOpenPostModal(true);
  };
  const handleSavePost = async (postId) => {
    setIsSaved(!isSaved);
    const response = await customFetch.post(`/post/${postId}/save`);
    console.log(response);
  };

  return (
    <Flex direction={"column"} padding="6">
      <Flex align={"center"} justifyContent={"space-between"} py={"10px"}>
        <Box display={"flex"} alignItems={"center"} gap={"10px"}>
          <Link to={`/profile/${author.username}`}>
            <Avatar src={author.profilePic} size={"md"} />
          </Link>
          <Link to={`/profile/${author.username}`}>
            <Text>{author.username}</Text>
          </Link>
          <Text
            color={"gray"}
            fontSize={"13px"}
            onClick={handleOpenModal}
            cursor="pointer"
          >
            . {date}
          </Text>
        </Box>
        <MenuComponent author={author} user={user} post={post} />
      </Flex>
      <Flex>
        {img ? (
          <img src={img} alt="" width={"100%"} />
        ) : (
          <Skeleton h={"200px"} />
        )}
      </Flex>
      <Flex justifyContent={"space-between"} alignItems={"center"} py={"10px"}>
        <Flex gap={"10px"} alignItems={"center"}>
          <Box
            as="button"
            cursor={"pointer"}
            fontSize={"25px"}
            onClick={handleLikePost}
            disabled={isLiking}
          >
            {isLiked ? <FaHeart style={{ color: "red" }} /> : <FaRegHeart />}
          </Box>
          <Box cursor={"pointer"} fontSize={"25px"} onClick={handleOpenModal}>
            <FaRegComment />
          </Box>
          <Box cursor={"pointer"} fontSize={"25px"}>
            <LuSend />
          </Box>
        </Flex>
        <Box
          cursor={"pointer"}
          fontSize={"23px"}
          onClick={() => handleSavePost(post.id)}
        >
          {!isSaved ? (
            <FaRegBookmark />
          ) : (
            <FaBookmark style={{ color: "red" }} />
          )}
        </Box>
      </Flex>
      <Flex direction={"column"} gap={"5px"}>
        <Text fontSize={"14px"} fontWeight={"semibold"}>
          {likes.length} likes
        </Text>
        <Box>
          <Text fontSize={"14px"} fontWeight={"semibold"}>
            {author.username}
          </Text>
          <Text
            as={"pre"}
            display={"inline"}
            fontWeight={"normal"}
            ml={"3px"}
            color={"gray.300"}
          >
            {content}
          </Text>
        </Box>
      </Flex>
      {comments?.length > 0 && (
        <Text
          color={"gray"}
          fontSize={"16px"}
          cursor={"pointer"}
          onClick={handleOpenModal}
        >
          View all {comments.length} comments
        </Text>
      )}
      <Text
        color={"gray"}
        fontSize={"16px"}
        cursor={"pointer"}
        onClick={handleOpenModal}
      >
        Add comment ...
      </Text>

      {/* Post Modal */}
      {isOpenPostModal && (
        <PostModal
          postId={selectedPostId}
          isOpen={isOpenPostModal}
          onClose={() => {
            setIsOpenPostModal(false);
            setSelectedPostId(null);
          }}
        />
      )}
    </Flex>
  );
}

export default Post;
