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
import { useNavigate, useParams } from "react-router";
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
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../features/user/postsSlice";
import MenuComponent from "../components/MenuComponent";
import { Link } from "react-router-dom";
import PostSkelton from "../components/PostSkelton";
function PostPage() {
  const { pId } = useParams();
  const { user } = useSelector((state) => state.user);
  const [isLiked, setIsLiked] = useState(false);
  const commentsEndRef = useRef();
  const [iscommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [content, setContent] = useState("");
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(`/post/${pId}`);
        setPost(response.data.post);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (commentsEndRef) {
      console.log(commentsEndRef);
      commentsEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [commentsEndRef]);
  useEffect(() => {
    if (post) {
      setIsLiked(post.likes.includes(user.id));
      setIsSaved(user.saved.uncludes(post.id));
    }
  }, [post, user.id, user.saved]);

  const handleLikePost = async () => {
    try {
      setIsLiking(true);
      setIsLiked(!isLiked);
      let filteredPost;
      if (isLiked) {
        toast({
          status: "success",
          title: "post unliked successfully",
          duration: 3000,
        });
        filteredPost = {
          ...post,
          likes: post.likes.filter((like) => like !== user.id),
        };
      } else {
        filteredPost = {
          ...post,
          likes: [...post.likes, user.id],
        };
        toast({
          status: "success",
          title: "post liked successfully",
          duration: 3000,
        });
      }
      setPost(filteredPost);
      await customFetch.post(`/post/${id}/like`);
      setIsLiking(false);
    } catch (error) {
      console.log(error);
      toast({ title: "cannot do this action", status: "error" });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const fetch = async () => {
      setIsCommenting(true);
      try {
        const response = await customFetch.post("/comment", {
          post: pId,
          content,
        });
        console.log(response.data.comment);
        setPost({
          ...post,
          comments: [...post.comments, response.data.comment],
        });

        toast({
          title: "comment added successfull",
          status: "success",
          duration: 3000,
        });
        setContent("");
      } catch (error) {
        console.log(error);
        toast({ title: "cannot add comment", status: "error", duration: 3000 });
      } finally {
        setIsCommenting(false);
      }
    };
    fetch();
  };
  if (loading) {
    return <PostSkelton />;
  }
  const handleSavePost = async (postId) => {
    setIsSaved(!isSaved);
    const response = await customFetch.post(`/post/${postId}/save`);
    console.log(response);
  };
  const { author, id, comments, createdAt, img, likes } = post;
  const postDate = getTimeDifference(new Date(createdAt));

  return (
    <Modal isOpen={true} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="black"
        color="white"
        maxW={{ base: "90%", sm: "70%", md: "620px", lg: "780px" }}
        h="auto" // Allow height to adjust based on content
      >
        <ModalCloseButton
          top={"-30px"}
          right={"-30px"}
          onClick={() => navigate(-1)}
        />
        <ModalBody p={0}>
          <Flex
            flexDirection={{ base: "column", md: "row" }}
            h="auto" // Allow the height to adjust based on content
          >
            <Box flex={1} display={"flex"}>
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
                h="auto" // Allow height to adjust based on content
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
                    <div ref={commentsEndRef}> </div>
                    <Flex flex={1} flexDirection={"column-reverse"}>
                      {comments.map((comment) => {
                        console.log(comment.likes);
                        return (
                          <Comment
                            date={getTimeDifference(
                              new Date(comment.createdAt)
                            )}
                            key={comment.id}
                            author={comment.author}
                            content={comment.content}
                            likes={comment.likes}
                            commentId={comment.id}
                          />
                        );
                      })}
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
                    onClick={() => handleSavePost(post.id)}
                  >
                    {isSaved ? (
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

export default PostPage;
