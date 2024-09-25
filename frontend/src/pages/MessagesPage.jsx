import {
  Avatar,
  Box,
  Flex,
  Heading,
  Input,
  Skeleton,
  SkeletonCircle,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import customFetch from "../utils/customFetch";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { getTimeDifferenceAbv } from "../utils/timeCalculater";
import { PiMessengerLogoBold } from "react-icons/pi";

import Chat from "../components/Chat";
import { useSocket } from "../context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { IoSearchSharp } from "react-icons/io5";
export const loader = async () => {
  try {
    const response = await customFetch("/message/getConversations");
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
function MessagesPage() {
  const { user } = useSelector((state) => state.user);
  const { onlineUsers } = useSocket();
  const { participantId } = useParams();
  const { conversations: conv, participant } = useLoaderData();
  const [searchValue, setsearchValue] = useState("");
  const dispatch = useDispatch();
  const [results, setResults] = useState([]);
  const [searchLoading, setIsSearchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  console.log(participant);

  const [chat, setChat] = useState(null);
  const [conversations, setConversations] = useState(conv);
  console.log(conv);

  conversations.sort((a, b) => {
    return (
      new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setIsSearchLoading(true);
      if (searchValue.length > 0) {
        const response = await customFetch(`/user/?searchParam=${searchValue}`);
        console.log(response);
        setResults(response.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      const response = await customFetch.get(
        `message/${participantId}/getMessages`
      );
      setChat(response.data.data);
      console.log(chat);
      setIsLoading(false);
    };
    if (participantId) {
      fetchMessages();
    }
  }, [participantId]);
  console.log(conversations);
  return (
    <Flex>
      <Flex
        maxW={"450px"}
        h={"100vh"}
        borderRight={"solid gray 0.5px"}
        flexDirection={"column"}
        overflowY={"auto"}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          borderBottom={"solid 1px gray"}
          p={"15px"}
          gap={"15px"}
        >
          <Box display={"flex"} alignItems={"center"}>
            <Heading letterSpacing={"1px"} fontSize={"25px"}>
              {user.username}
            </Heading>
          </Box>
          <Box
            as="form"
            onSubmit={handleSearch}
            bg={"#54545470"}
            borderRadius={"10px"}
            display={"flex"}
            gap={"10px"}
            p={"7px"}
            px={"14px"}
            position={"relative"}
            alignSelf={"center"}
          >
            {/* <IoSearchSharp fontSize={"20px"} fontWeight={"bold"} /> */}
            <Input
              onChange={(e) => setsearchValue(e.target.value)}
              value={searchValue}
              bg={"transparent"}
              display={"inline"}
              placeholder="search for user..."
              _focus={{
                outline: "none",
                boxShadow: "none",
              }}
              _focusWithin={{
                outline: "none",
                boxShadow: "none",
              }}
            />
            {/* <Text
              cursor={"pointer"}
              onClick={() => {
                setResults([]);
                setsearchValue("");
              }}
            >
              x
            </Text> */}
            <Box
              bg={"gray.dark"}
              w={"300px"}
              position={"absolute"}
              top={"48px"}
              right={"5px"}
              borderRadius={"lg"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              maxHeight={"75vh"}
              overflowY={"scroll"}
            ></Box>
          </Box>
        </Box>
        {results.length > 0 && searchValue.length > 0 ? (
          searchLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => {
                return (
                  <Box
                    key={i}
                    display={"flex"}
                    justifyContent={"space-between"}
                    w={"100%"}
                    p={"10px"}
                    alignItems={"center"}
                    gap={"30px"}
                  >
                    <SkeletonCircle h={"60px"} w={"60px"} />
                    <Box flex={1}>
                      <Skeleton h={"10px"} />
                    </Box>
                  </Box>
                );
              })}
            </>
          ) : (
            <>
              {results.length === 0 ? (
                <Text minH={"70px"} mt={"40px"}>
                  No results found
                </Text>
              ) : (
                <>
                  {results.map((result) => {
                    return (
                      <Flex
                        as={Link}
                        to={`/messages/${result.id}`}
                        onClick={() => {
                          setResults([]);
                          setsearchValue("");
                        }}
                        key={result.id}
                        gap={"20px"}
                        p={"10px"}
                        align={"center"}
                      >
                        <Avatar src={result.profilePic} position={"relative"}>
                          {onlineUsers.includes(result.id) && (
                            <Box
                              h={"13px"}
                              w={"13px"}
                              position={"absolute"}
                              borderRadius={"100%"}
                              bg={"#00d000"}
                              bottom={0}
                              border={"black solid 3px"}
                              right={0}
                            />
                          )}
                        </Avatar>
                        <Box flex={1}>
                          <Text fontSize={"15px"}>{result.name}</Text>
                        </Box>
                      </Flex>
                    );
                  })}
                </>
              )}
            </>
          )
        ) : (
          <>
            {conversations.map((conversation) => {
              const updatedAt = getTimeDifferenceAbv(
                new Date(conversation.lastMessage.createdAt)
              );
              const lastMessage = `${
                `${conversation.lastMessage?.text.slice(0, 8)}${
                  conversation.lastMessage?.text.length > 8 ? "..." : ""
                }` || "attachment"
              } . ${updatedAt}`;
              const notSeen =
                !conversation.lastMessage.seen &&
                conversation.lastMessage.sender !== user.id;

              return (
                conversations.length > 0 && (
                  <Flex
                    as={Link}
                    to={`/messages/${conversation.participants[0].id}`}
                    key={conversation.id}
                    gap={"20px"}
                    p={"10px"}
                    align={"center"}
                  >
                    <Avatar
                      src={conversation.participants[0].profilePic}
                      position={"relative"}
                    >
                      {onlineUsers.includes(
                        conversation.participants[0].id
                      ) && (
                        <Box
                          h={"13px"}
                          w={"13px"}
                          position={"absolute"}
                          borderRadius={"100%"}
                          bg={"#00d000"}
                          bottom={0}
                          border={"black solid 3px"}
                          right={0}
                        />
                      )}
                    </Avatar>
                    <Box flex={1}>
                      <Text
                        fontSize={"15px"}
                        fontWeight={notSeen ? "semibold" : "normal"}
                      >
                        {conversation.participants[0].name}
                      </Text>
                      <Text
                        fontSize={"13px"}
                        color={"#c3c3c3"}
                        fontWeight={notSeen ? "semibold" : "normal"}
                      >
                        {lastMessage}
                      </Text>
                    </Box>
                  </Flex>
                )
              );
            })}
          </>
        )}
      </Flex>
      <Flex flex={1} h={"100vh"} overflowY={"auto"}>
        {!chat && !isLoading ? (
          <Flex
            justifyContent={"center"}
            flexDirection={"column"}
            align={"center"}
            gap={"10px"}
            w={"100%"}
          >
            <PiMessengerLogoBold fontSize={"100px"} />
            <Text fontSize={"25px"} fontWeight={"semibold"}>
              Your Messages
            </Text>
            <Text fontSize={"14px"} color={"gray"}>
              Send a message to start a chat
            </Text>
          </Flex>
        ) : (
          <>
            {isLoading ? (
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                flex={1}
                h={"100%"}
              >
                <Spinner size={"xl"} />
              </Flex>
            ) : (
              <Chat {...chat} setConversations={setConversations} />
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
}

export default MessagesPage;
