import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import customFetch from "../utils/customFetch";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { followUnfollowUser } from "../features/user/userSlice";

function SidebarSearch() {
  const { user } = useSelector((state) => state.user);
  const [results, setResults] = useState([]);
  const dispatch = useDispatch();
  const [searchValue, setsearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  const performSearch = async (searchQuery) => {
    try {
      setIsLoading(true);
      if (searchQuery.length > 0) {
        const response = await customFetch(`/user/?searchParam=${searchQuery}`);
        console.log(response);
        setResults(response.data);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const debouncedSearch = debounce(performSearch, 300);
  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue]);
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  };
  const handleFollowUnfollow = async (e, id) => {
    e.preventDefault();
    dispatch(followUnfollowUser(id));
    await customFetch.post(`/user/followUnfollow/${id}`);
  };
  return (
    <Box
      position={"absolute"}
      h={"100vh"}
      w={"350px"}
      bg={"black"}
      top={"0px"}
      zIndex={3}
      left={"102%"}
      display={"flex"}
      flexDirection={"column"}
      p={"10px"}
      overflowY={"auto"}
    >
      <Box
        as="form"
        borderRadius={"xl"}
        bg={"gray.dark"}
        display={"flex"}
        gap={"5px"}
        alignItems={"center"}
        onSubmit={handleSearch}
        p={"10px"}
      >
        <Input
          onChange={(e) => setsearchValue(e.target.value)}
          value={searchValue}
          bg={"none"}
          flex={1}
          placeholder="Search..."
          fontSize={"15px"}
          _focusWithin={{
            outline: "none",
            boxShadow: "none",
          }}
        />
        <Text as={"button"} fontSize={"20px"} cursor={"pointer"} type="button">
          <FaSearch />
        </Text>
      </Box>
      <Flex flexDirection={"column"}>
        {isLoading ? (
          [1, 2, 3, 4, 5].map((i) => {
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
                <SkeletonCircle h={"50px"} w={"50px"} />

                <Box flex={1}>
                  <Skeleton h={"10px"} />
                </Box>
              </Box>
            );
          })
        ) : (
          <>
            {results.length > 0 ? (
              results.map((result, i) => {
                return (
                  <Box
                    as={Link}
                    to={`/profile/${result.username}`}
                    key={i}
                    display={"flex"}
                    justifyContent={"space-between"}
                    w={"100%"}
                    p={"10px"}
                    alignItems={"center"}
                  >
                    <Box display={"flex"} alignItems={"center"} gap={"10px"}>
                      <Avatar src={result.profilePic} />
                      <Text fontSize={"15px"}>{result.username}</Text>
                    </Box>
                    <>
                      <Box onClick={(e) => handleFollowUnfollow(e, result.id)}>
                        {user.following.includes(result.id) ? (
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
                    </>
                  </Box>
                );
              })
            ) : searchValue.length > 0 && results.length === 0 ? (
              <Text
                fontSize={"17px"}
                w={"80%"}
                textAlign={"center"}
                m={"auto"}
                mt={"20px"}
              >
                No results found, please try again
              </Text>
            ) : (
              <></>
            )}
          </>
        )}
      </Flex>
    </Box>
  );
}

export default SidebarSearch;
