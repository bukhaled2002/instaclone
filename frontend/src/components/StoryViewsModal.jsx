import {
  Avatar,
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import customFetch from "../utils/customFetch";
import { FaHeart } from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";

function StoryViewsModal({ isOpen, onClose, storyId }) {
  const [storyViewers, setStoryViewers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const response = await customFetch(`/story/${storyId}/views`);
      console.log(response);
      setStoryViewers(response.data.story);
      setIsLoading(false);
    };
    fetch();
  }, [storyId]);
  console.log(storyViewers);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent
        h={"500px"}
        w={"400px"}
        borderRadius={0}
        p={0}
        bg={"gray.dark"}
      >
        <ModalHeader>People views the story</ModalHeader>
        <ModalBody textAlign={"center"} overflowY={"auto"}>
          {isLoading ? (
            <Spinner marginTop={"100px"} size={"xl"} />
          ) : (
            <>
              {storyViewers.storyViews.length < 1 ? (
                <Flex justifyContent={"center"} align={"center"} h={"90%"}>
                  <Text fontSize={"20px"}>No Views found</Text>
                </Flex>
              ) : (
                <>
                  <Flex gap={"20px"} flexDir={"column"} h={"90%"}>
                    {storyViewers.storyViews.map((item) => {
                      console.log(storyViewers.likes, item.id);
                      const isLiking = storyViewers.likes.includes(item.id);
                      return (
                        <Box
                          key={item.id}
                          display={"flex"}
                          justifyContent={"space-between"}
                          alignItems={"center"}
                          fontWeight={"semibold"}
                          order={isLiking ? -1 : "unset"}
                        >
                          <Link
                            to={`/profile/${item.username}`}
                            onClick={onClose}
                          >
                            <Text>{item.username}</Text>
                          </Link>
                          <Link
                            to={`/profile/${item.username}`}
                            onClick={onClose}
                          >
                            <Avatar src={item.profilePic} position={"relative"}>
                              <Box
                                position={"absolute"}
                                bottom={"-4px"}
                                right={"0"}
                              >
                                <FaHeart color="red" />
                              </Box>
                            </Avatar>
                          </Link>
                        </Box>
                      );
                    })}
                  </Flex>
                </>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default StoryViewsModal;
