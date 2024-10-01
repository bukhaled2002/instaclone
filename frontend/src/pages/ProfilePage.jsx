import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import PostModal from "../components/PostModal";
import { followUnfollowUser } from "../features/user/userSlice";
import FollowInfoModal from "../components/FollowInfoModal";
import { Link } from "react-router-dom";
import GridPosts from "../components/GridPosts";

export const loader = async ({ params }) => {
  try {
    const response = await customFetch(`/post/user/${params.username}`);
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw new Error("Cannot get profile");
  }
};

function ProfilePage() {
  const { user, posts } = useLoaderData();
  const { user: me } = useSelector((state) => state.user);
  console.log(user);
  console.log(me.following.includes(user.id));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalData, setModalData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(
    me.following.includes(user.id)
  );
  const [Loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const openModal = (type) => {
    console.log(type);
    if (type === "followers") {
      setModalData({ title: "Followers" });
    } else {
      setModalData({ title: "Following" });
    }
    onOpen();
  };

  const handleFollowUnfollow = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      setIsFollowing(!isFollowing);
      dispatch(followUnfollowUser(user.id));
      console.log(user.following);

      const response = await customFetch.post(
        `/user/followUnfollow/${user.id}`
      );
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const isViewed = !user.stories
    .map((story) => story.storyViews)
    .some((arr) => !arr.includes(me.id));

  return (
    <>
      <Container
        mt={{ base: "40px", md: "60px" }}
        p={0}
        maxWidth={{ base: "unset", md: "560px", lg: "780px" }}
      >
        {/* Info */}
        <Flex display={"flex"} flexDirection={"column"} gap={"15px"}>
          <Flex
            gap={{ base: "30px", md: "50px" }}
            px={"14px"}
            maxWidth={{ base: "unset", lg: "650px" }}
            margin={"auto"}
          >
            <Box
              border={
                user.stories.length > 0 &&
                `${isViewed | (me.id === user.id) ? "gray" : "red"} solid 4px`
              }
              h={"fit-content"}
              borderRadius={"100%"}
            >
              {user.stories.length > 0 ? (
                <Avatar
                  as={Link}
                  state={location.pathname}
                  to={`/stories/${user.username}`}
                  m={"4px"}
                  size={{ base: "lg", sm: "xl", md: "2xl" }}
                  src={user.profilePic}
                />
              ) : (
                <Avatar
                  m={"4px"}
                  size={{ base: "lg", sm: "xl", md: "2xl" }}
                  src={user.profilePic}
                />
              )}
            </Box>
            <Flex flexDirection={"column"} flex={1} gap={"15px"}>
              <Flex
                align={"center"}
                gap={{ base: "15px", md: "25px" }}
                flexWrap={"wrap"}
              >
                <Text>{user.username}</Text>
                <Flex
                  gap={"10px"}
                  order={{ base: 3, sm: "unset" }}
                  align={"center"}
                >
                  {user.id === me.id ? (
                    <>
                      <Button
                        as={Link}
                        to={"/setting"}
                        bg={"gray"}
                        borderRadius={"5px"}
                        size={"sm"}
                        w={{ base: "90px", md: "100px" }}
                        letterSpacing={"1px"}
                        fontSize={{ base: "12px", md: "14px" }}
                      >
                        Edit Profile
                      </Button>
                      <IoMdSettings fontSize={"20px"} />
                    </>
                  ) : (
                    <>
                      <Button
                        size={"sm"}
                        bg={isFollowing ? "gray" : "brand.secondary"}
                        letterSpacing={"1px"}
                        borderRadius={"5px"}
                        disabled={Loading}
                        fontSize={{ base: "12px", md: "14px" }}
                        w={{ base: "70px", md: "90px" }}
                        onClick={handleFollowUnfollow}
                      >
                        {Loading
                          ? "loading..."
                          : isFollowing
                          ? "Following"
                          : "Follow"}
                      </Button>
                      <Button
                        as={Link}
                        to={`/messages/${user.id}`}
                        bg={"gray"}
                        borderRadius={"5px"}
                        size={"sm"}
                        w={{ base: "70px", md: "90px" }}
                        letterSpacing={"1px"}
                        fontSize={{ base: "12px", md: "14px" }}
                      >
                        Message
                      </Button>
                    </>
                  )}
                </Flex>
                <Text
                  fontWeight={900}
                  letterSpacing={"1px"}
                  lineHeight={"18px"}
                >
                  ...
                </Text>
              </Flex>
              <Flex justifyContent={"space-between"} align={"center"}>
                <Text>{posts.length} posts</Text>
                <Text cursor={"pointer"} onClick={() => openModal("followers")}>
                  {user.followers.length} followers
                </Text>
                <Text cursor={"pointer"} onClick={() => openModal("following")}>
                  {user.following.length} following
                </Text>
                {modalData && (
                  <FollowInfoModal
                    isOpen={isOpen}
                    onClose={onClose}
                    title={modalData.title}
                    userId={user.id}
                  />
                )}
              </Flex>
              <Heading
                fontSize={{ base: "16px", md: "20px" }}
                fontWeight={"semibold"}
                mt={"10px"}
              >
                {user.name}
              </Heading>
              <Text>{user.bio}</Text>
              <Text fontSize={"13px"} color={"gray"}>
                Followed by {user.following.length}
              </Text>
            </Flex>
          </Flex>
          <Flex
            align={"center"}
            justifyContent={"center"}
            borderTop={"solid 0.5px gray"}
            borderBottom={"solid 0.5px gray"}
          >
            <Text
              borderBottom={"solid 1px white"}
              py={"10px"}
              flex={1}
              textAlign={"center"}
            >
              Posts
            </Text>
            <Text py={"10px"} flex={1} textAlign={"center"}>
              Reels
            </Text>
            <Text py={"10px"} textAlign={"center"} flex={1}>
              Tags
            </Text>
          </Flex>
        </Flex>
        <GridPosts />
      </Container>
    </>
  );
}

export default ProfilePage;
