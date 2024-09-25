import {
  Avatar,
  Box,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import customFetch from "../utils/customFetch";
import {
  FaBookmark,
  FaHeart,
  FaRegBookmark,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { getTimeDifference } from "../utils/timeCalculater";
import Comment from "../components/Comment";
import MenuComponent from "../components/MenuComponent";
import { Link } from "react-router-dom";
import PostSkeleton from "../components/PostSkelton";
import { useDispatch, useSelector } from "react-redux";
import { saveUnsavePost } from "../features/user/userSlice";

function PostModal({ postId, isOpen, onClose }) {
  const { user } = useSelector((state) => state.user);
  const [isLiked, setIsLiked] = useState(false);
  const commentsEndRef = useRef();
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [content, setContent] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(`/post/${postId}`);
        setPost(response.data.post);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  useEffect(() => {
    if (post) {
      setIsLiked(post.likes.includes(user.id));
      console.log(user.saved, post.id);

      setIsSaved(user.saved.includes(post.id));
    }
  }, [post, user.id, user.saved]);

  const handleLikePost = async () => {
    try {
      setIsLiking(true);
      setIsLiked(!isLiked);
      let updatedPost;

      if (isLiked) {
        updatedPost = {
          ...post,
          likes: post.likes.filter((like) => like !== user.id),
        };
        toast({
          status: "success",
          title: "Post unliked successfully",
          duration: 3000,
        });
      } else {
        updatedPost = {
          ...post,
          likes: [...post.likes, user.id],
        };
        toast({
          status: "success",
          title: "Post liked successfully",
          duration: 3000,
        });
      }

      setPost(updatedPost);
      await customFetch.post(`/post/${postId}/like`);
    } catch (error) {
      console.log(error);
      toast({ title: "Cannot perform this action", status: "error" });
    } finally {
      setIsLiking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitComment = async () => {
      setIsCommenting(true);
      try {
        const response = await customFetch.post("/comment", {
          post: postId,
          content,
        });

        setPost((prevPost) => ({
          ...prevPost,
          comments: [...prevPost.comments, response.data.comment],
        }));

        toast({
          title: "Comment added successfully",
          status: "success",
          duration: 3000,
        });
        setContent("");
      } catch (error) {
        console.log(error);
        toast({ title: "Cannot add comment", status: "error", duration: 3000 });
      } finally {
        setIsCommenting(false);
      }
    };
    submitComment();
  };
  const handleSavePost = async (postId) => {
    setIsSaved(!isSaved);
    dispatch(saveUnsavePost(postId));
    const response = await customFetch.post(`/post/${postId}/save`);
    console.log(response);
  };
  if (loading) {
    return <PostSkeleton />;
  }

  const { author, comments, createdAt, img, likes } = post;
  const postDate = getTimeDifference(new Date(createdAt));

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="black"
        color="white"
        maxW={{ base: "90%", sm: "70%", md: "620px", lg: "780px" }}
      >
        <ModalCloseButton top={"-30px"} right={"-30px"} onClick={onClose} />
        <ModalBody p={0}>
          <Flex flexDirection={{ base: "column", md: "row" }}>
            <Box
              flex={1}
              display={"flex"}
              maxH={{ base: "200px", md: "unset" }}
            >
              <Image src={img} w={"100%"} objectFit={"contain"} />
            </Box>
            <Flex flex={1} flexDirection={"column"}>
              <Flex
                borderBottom={"solid 0.5px gray"}
                w={"100%"}
                p={"10px"}
                justifyContent={"space-between"}
              >
                <Flex gap={"5px"} align={"center"}>
                  <Link to={`/profile/${author.username}`} relative={"path"}>
                    <Avatar src={author.profilePic} />
                  </Link>
                  <Link to={`/profile/${author.username}`} relative={"path"}>
                    <Text>{author.username}</Text>
                  </Link>
                </Flex>
                <MenuComponent author={author} user={user} post={post} />
              </Flex>
              <Flex
                direction={"column"}
                overflowY={"auto"}
                maxH={{ base: "25vh", md: "60vh" }}
              >
                <Comment
                  author={author}
                  content={post.content}
                  date={postDate}
                  likes={likes}
                  isPostPublisher={true}
                />
                {comments.length > 0 ? (
                  <>
                    <div ref={commentsEndRef}></div>
                    <Flex flex={1} flexDirection={"column-reverse"}>
                      {comments.map((comment) => (
                        <Comment
                          key={comment.id}
                          date={getTimeDifference(new Date(comment.createdAt))}
                          author={comment.author}
                          content={comment.content}
                          likes={comment.likes}
                          commentId={comment.id}
                        />
                      ))}
                    </Flex>
                  </>
                ) : (
                  <Flex
                    flex={1}
                    justifyContent={"center"}
                    align={"center"}
                    flexDirection={"column"}
                    minH={"200px"}
                  >
                    <Text fontSize={"24px"} fontWeight={"bold"}>
                      No comments yet
                    </Text>
                    <Text fontSize={"14px"} fontWeight={"300"}>
                      Start the conversation
                    </Text>
                  </Flex>
                )}
              </Flex>
              <Flex
                as={"form"}
                flexDirection={"column"}
                onSubmit={handleSubmit}
              >
                <Flex
                  w={"100%"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  p={"10px"}
                  borderTop={"solid 0.5px gray"}
                >
                  <Flex gap={"10px"} alignItems={"center"}>
                    <Box
                      as="button"
                      type="button"
                      cursor={"pointer"}
                      fontSize={"25px"}
                      onClick={handleLikePost}
                      disabled={isLiking}
                    >
                      {isLiked ? (
                        <FaHeart style={{ color: "red" }} />
                      ) : (
                        <FaRegHeart />
                      )}
                    </Box>
                    <Box cursor={"pointer"} fontSize={"25px"}>
                      <FaRegComment />
                    </Box>
                    <Box cursor={"pointer"} fontSize={"25px"}>
                      <LuSend />
                    </Box>
                  </Flex>
                  <Box
                    cursor={"pointer"}
                    fontSize={"23px"}
                    onClick={() => handleSavePost(postId)}
                  >
                    {!isSaved ? (
                      <FaRegBookmark />
                    ) : (
                      <FaBookmark style={{ color: "red" }} />
                    )}
                  </Box>
                </Flex>
                <Flex direction={"column"} gap={"5px"} p={"10px"}>
                  <Text fontSize={"14px"} fontWeight={"semibold"}>
                    {likes.length} likes
                  </Text>
                </Flex>
                <Flex
                  justify={"space-between"}
                  p={"10px"}
                  align={"center"}
                  borderTop={"solid 0.5px gray"}
                  gap={"5px"}
                >
                  <Avatar src={user.profilePic} />
                  <Input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add a comment"
                    bg={"transparent"}
                    flex={1}
                  />
                  <Text as={"button"} type="submit">
                    Post
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PostModal;
