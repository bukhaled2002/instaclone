import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { followUnfollowUser } from "../features/user/userSlice";
function Header() {
  const { pathname } = useLocation();

  const { user } = useSelector((state) => state.user);
  const { username } = useParams();
  const [searchValue, setsearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

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

  const handleFollowUnfollow = async (e, id) => {
    e.preventDefault();
    dispatch(followUnfollowUser(id));
    await customFetch.post(`/user/followUnfollow/${id}`);
  };
  return (
    <Flex
      as={"header"}
      display={{ base: "flex", md: "none" }}
      position={"fixed"}
      h={"60px"}
      align="center"
      borderBottom={"solid gray 0.5px"}
      bg={"black"}
      zIndex={2}
      w={"100%"}
      right={0}
      py={"10px"}
      px={"15px"}
      justifyContent={"space-between"}
      top={0}
    >
      {pathname.startsWith("/profile") ? (
        <>
          <Box
            cursor={"pointer"}
            onClick={() => navigate("/", { relative: false })}
          >
            <FaChevronLeft />
          </Box>
          <Box flex={1}>
            <Text
              textAlign={"center"}
              letterSpacing={"1px"}
              fontWeight={"semibold"}
            >
              {username}
            </Text>
          </Box>
        </>
      ) : (
        <>
          <Text>insta</Text>
          <Box
            bg={"#54545470"}
            borderRadius={"10px"}
            display={"flex"}
            gap={"10px"}
            p={"7px"}
            px={"14px"}
            position={"relative"}
          >
            <IoSearchSharp fontSize={"20px"} fontWeight={"bold"} />
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
            <Text
              cursor={"pointer"}
              onClick={() => {
                setResults([]);
                setsearchValue("");
              }}
            >
              x
            </Text>
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
            >
              {isLoading ? (
                <>
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
                </>
              ) : (
                <>
                  {results.length == 0 && searchValue.length > 0 ? (
                    <Text minH={"70px"} mt={"40px"}>
                      No results found
                    </Text>
                  ) : (
                    <>
                      {results.map((result, i) => {
                        console.log(searchValue);
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
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              gap={"10px"}
                            >
                              <Avatar src={result.profilePic} />
                              <Text>{result.username}</Text>
                            </Box>
                            <>
                              <Box
                                onClick={(e) =>
                                  handleFollowUnfollow(e, result.id)
                                }
                              >
                                {user.following.includes(result.id) ? (
                                  <Button
                                    bg={"gray"}
                                    size={"sm"}
                                    rounded={"sm"}
                                    w={"80px"}
                                  >
                                    Following
                                  </Button>
                                ) : (
                                  <Button size={"sm"} rounded={"sm"} w={"80px"}>
                                    Follow
                                  </Button>
                                )}
                              </Box>
                            </>
                          </Box>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </Box>
          </Box>
        </>
      )}
    </Flex>
  );
}

export default Header;
