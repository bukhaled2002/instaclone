import {
  Avatar,
  Box,
  Button,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../utils/customFetch";
import { followUnfollowUser } from "../features/user/userSlice";
import { Link } from "react-router-dom";

const Suggestion = () => {
  const [loading, setloading] = useState(true);
  const dispatch = useDispatch();
  const [suggestedList, setSuggestedList] = useState([]);
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const fetch = async () => {
      setloading(true);
      const response = await customFetch("/user/suggestFriends");
      setSuggestedList(response.data.suggestions);
      setloading(false);
    };
    fetch();
  }, []);

  const handleFollowUnfollow = async (e, id) => {
    e.preventDefault();
    if (id !== user.id) {
      dispatch(followUnfollowUser(id));
      await customFetch.post(`/user/followUnfollow/${id}`);
    }
  };
  return (
    <Box
      m={"auto"}
      minW={"200px"}
      w={"320px"}
      display={"flex"}
      flexDir={"column"}
      p={"10px"}
      mt={"25px"}
      gap={"10px"}
    >
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Box display="flex" gap={"15px"} flex>
          <Avatar
            as={Link}
            to={`/profile/${user.username}`}
            src={user.profilePic}
          />
          <Box>
            <Text
              as={Link}
              to={`/profile/${user.username}`}
              fontSize={"15px"}
              fontWeight={"semibold"}
            >
              {user.username}
            </Text>
            <Text fontSize={"12px"}>{user.name}</Text>
          </Box>
        </Box>
        <Text color={"blue.300"} fontSize={"12px"}>
          switch
        </Text>
      </Flex>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text fontSize={"14px"} color={"gray"}>
          Suggested for you
        </Text>
        <Text fontSize={"12px"}>See All</Text>
      </Flex>
      {loading ? (
        <>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Flex key={i} justifyContent={"space-between"}>
              <Box display={"flex"} alignItems={"center"} gap={"20px"}>
                <SkeletonCircle size={"50px"} />
                <Box display={"flex"} gap={"5px"} flexDir={"column"}>
                  <Skeleton h={"6px"} w={"150px"} />
                  <Skeleton h={"6px"} w={"150px"} />
                </Box>
              </Box>
            </Flex>
          ))}
        </>
      ) : (
        <>
          {suggestedList.map((item) => {
            console.log(item._id, user.following);
            return (
              <Flex
                key={item.id}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Box display="flex" gap={"15px"} flex>
                  <Avatar src={item.profilePic} />
                  <Box>
                    <Text fontSize={"15px"} fontWeight={"semibold"}>
                      {item.username}
                    </Text>
                    <Text fontSize={"12px"}>{item.name}</Text>
                  </Box>
                </Box>
                <Box onClick={(e) => handleFollowUnfollow(e, item._id)}>
                  {user.following.includes(item._id) ? (
                    <Button
                      bg={"gray"}
                      size={"sm"}
                      rounded={"sm"}
                      w={"80px"}
                      fontSize={"12px"}
                    >
                      Following
                    </Button>
                  ) : (
                    <Button
                      size={"sm"}
                      fontSize={"12px"}
                      rounded={"sm"}
                      w={"80px"}
                    >
                      Follow
                    </Button>
                  )}
                </Box>
              </Flex>
            );
          })}
        </>
      )}
    </Box>
  );
};

export default Suggestion;
