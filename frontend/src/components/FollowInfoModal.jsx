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
import React, { useEffect, useState } from "react";
import customFetch from "../utils/customFetch";
import { Link } from "react-router-dom";

function FollowInfoModal({ isOpen, onClose, title, userId }) {
  const [followInfo, setFollowInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const response = await customFetch(`/user/${userId}/${title}`);
      const info = response.data[title.toLowerCase()];
      console.log(info);
      setFollowInfo(info);
      setIsLoading(false);
    };
    fetch();
  }, [title]);
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
        <ModalHeader>{title}</ModalHeader>
        <ModalBody textAlign={"center"} overflowY={"auto"}>
          {isLoading ? (
            <Spinner marginTop={"100px"} size={"xl"} />
          ) : (
            <>
              {followInfo.length < 1 ? (
                <Flex justifyContent={"center"} align={"center"} h={"90%"}>
                  <Text fontSize={"20px"}>No {title} found</Text>
                </Flex>
              ) : (
                <>
                  <Flex gap={"20px"} flexDir={"column"} h={"90%"}>
                    {followInfo.map((item) => (
                      <Box
                        key={item.id}
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        fontWeight={"semibold"}
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
                          <Avatar src={item.profilePic} />
                        </Link>
                      </Box>
                    ))}
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

export default FollowInfoModal;
