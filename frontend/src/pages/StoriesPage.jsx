import React, { useEffect, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import customFetch from "../utils/customFetch";
import {
  Avatar,
  Box,
  Flex,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiSendPlaneFill } from "react-icons/ri";
import { useSocket } from "../context/SocketContext";
import { useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import StoryViewsModal from "../components/StoryViewsModal";

export const loader = async ({ params }) => {
  const response = await customFetch(`/story/${params.username}`);
  return response.data;
};

function StoriesPage() {
  const [replyInput, setReplyInput] = useState("");
  const location = useLocation();
  console.log(location);
  console.log(location.state);
  const path = location.state || "/";
  const navigate = useNavigate();
  const { stories } = useLoaderData();
  const { user } = useSelector((state) => state.user);
  const [storyIndex, setStoryIndex] = useState(0);
  const { socket } = useSocket();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalData, setModalData] = useState(false);
  const isMyStory = user.id === stories[0].author.id;
  const [timer, setTimer] = useState(5);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // New state to manage pause
  const nextStory = () => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex(storyIndex + 1);
      resetTimer();
    } else {
      navigate(path);
    }
  };

  const resetTimer = () => {
    setTimer(5);
    setProgress(0);
  };

  console.log(progress);
  useEffect(() => {
    if (!isMyStory) {
      socket.emit("setStorySeen", {
        userId: user.id,
        storyId: stories[storyIndex].id,
      });
    }
  }, [isMyStory, socket, stories, storyIndex, user.id]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!isPaused) {
        setTimer((prev) => {
          if (prev <= 0) {
            nextStory();
            return 5;
          }
          return prev - 1;
        });

        setProgress((prev) => {
          return Math.min(prev + 20, 100);
        });
      }
    }, 1000);

    return () => clearInterval(id);
  }, [storyIndex, isPaused]);

  useEffect(() => {
    if (isOpen) {
      setIsPaused(true); // Pause timer
    } else {
      setIsPaused(false); // Resume timer
    }
  }, [isOpen]);

  const handleStoryReply = async (e) => {
    e.preventDefault();
    // Handle reply logic here
  };

  const [isLiked, setIsLiked] = useState(
    stories[storyIndex]?.likes.includes(user.id)
  );

  const handleLikeStory = async () => {
    setIsLiked(!isLiked);
    const response = await customFetch.post(
      `/story/likeUnlikeStory/${stories[storyIndex].id}`
    );
    console.log(response);
  };

  return (
    <>
      <Flex justify={"center"}>
        <Text
          as={"button"}
          onClick={() => {
            navigate(path);
          }}
          position={"absolute"}
          top={"10px"}
          right={"20px"}
          fontSize={"25px"}
        >
          X
        </Text>
        <Box
          h={"85vh"}
          w={"350px"}
          bg={"gray"}
          mt={"50px"}
          bgImage={stories[storyIndex].media}
          bgSize={"contain"}
          bgPosition={"center"}
          display={"flex"}
          bgRepeat={"no-repeat"}
          borderRadius={"lg"}
          p={"10px"}
          pt={"20px"}
          flexDir={"column"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Flex direction={"column"} w={"100%"} gap={"10px"}>
            <Box as="span" h={"3px"} w={"100%"} gap={"5px"} display={"flex"}>
              {Array.from({ length: stories.length }, (_, i) => i).map((i) => (
                <Box
                  key={i}
                  as="span"
                  h={"100%"}
                  flex={1}
                  bg={"#c2c2c2"}
                  display={"flex"}
                >
                  {i === storyIndex && (
                    <Box
                      as={"span"}
                      bg={"white"}
                      h={"100%"}
                      w={`${progress}%`}
                      transition="width 1s linear"
                    ></Box>
                  )}
                </Box>
              ))}
            </Box>
            <Box display={"flex"} gap={"10px"} alignItems={"center"}>
              <Avatar src={stories[0].author.profilePic} />
              <Text fontWeight={"semibold"}>{stories[0].author.username}</Text>
            </Box>
          </Flex>
          {!isMyStory ? (
            <Box
              as={"form"}
              w={"90%"}
              mb={"5px"}
              display={"flex"}
              onSubmit={handleStoryReply}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Box cursor={"pointer"} onClick={handleLikeStory}>
                {isLiked ? (
                  <FaHeart fontSize={"27px"} color="red" />
                ) : (
                  <FaRegHeart fontSize={"27px"} />
                )}
              </Box>
              {/* <Input
                placeholder="Add comment..."
                p={"8px"}
                flex={1}
                borderRadius={"2xl"}
                border={"white solid 2px"}
                bg={"transparent"}
                _placeholder={{ color: "white" }}
                onChange={(e) => setReplyInput(e.target.value)}
                value={replyInput}
              /> */}
              <Text as={"button"} type="submit">
                <RiSendPlaneFill fontSize={"25px"} />
              </Text>
            </Box>
          ) : (
            <Text
              alignSelf={"start"}
              fontSize={"14px"}
              cursor={"pointer"}
              onClick={() => {
                setModalData(true);
                onOpen();
              }}
            >
              Seen by {stories[storyIndex].storyViews.length}
            </Text>
          )}
        </Box>
      </Flex>
      {modalData && (
        <StoryViewsModal
          isOpen={isOpen}
          onClose={onClose}
          storyId={stories[storyIndex].id}
        />
      )}
    </>
  );
}

export default StoriesPage;
