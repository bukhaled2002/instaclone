import {
  Box,
  Flex,
  Image,
  Heading,
  Spacer,
  Avatar,
  Button,
  Text,
  Skeleton,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import customFetch from "../utils/customFetch";
const StoryItem = ({ username, image, isViewed, storiesAuthers }) => {
  const { user } = useSelector((state) => state.user);
  return (
    <Box
      as={Link}
      to={`stories/${username}`}
      mx={2}
      cursor={"pointer"}
      order={!isViewed | (user.username === username) ? -1 : "unset"}
    >
      <Box
        p={"3px"}
        m={0}
        borderRadius="full"
        h={"64px"}
        w={"64px"}
        border={`solid 3px ${isViewed ? "gray" : "red"}`}
      >
        <Avatar src={image} alt={username} w={"100%"} h={"100%"} />
      </Box>
      <Heading size="sm" mt={2} textAlign="center" fontWeight={400}>
        {username === user.username ? "Your Story" : username}
      </Heading>
    </Box>
  );
};

const Stories = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setloading] = useState(true);
  const [storiesObj, setStoriesObj] = useState({});
  useEffect(() => {
    const fetch = async () => {
      setloading(true);
      const response = await customFetch("/story/groupedStories");
      response.data.forEach(({ author, stories }) => {
        setStoriesObj((prevStoriesObj) => ({
          ...prevStoriesObj,
          [author.username]: { stories, author },
        }));
      });
      setloading(false);
    };
    fetch();
  }, []);

  console.log(Object.values(storiesObj));
  const storiesAuthers = Object.keys(storiesObj);
  console.log(user);

  return (
    <>
      <Box top={0} zIndex={1} py={4}>
        <Flex
          overflowX="auto"
          gap={"2px"}
          css={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <>
            {loading ? (
              <HStack spacing={4} padding={4}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Box
                    key={index}
                    borderRadius="full"
                    overflow="hidden"
                    boxShadow="md"
                  >
                    <Skeleton height="64px" width="64px" borderRadius="full" />
                  </Box>
                ))}
              </HStack>
            ) : (
              <>
                {user.stories.length > 0 && (
                  <StoryItem
                    isViewed={true}
                    username={user.username}
                    image={user.profilePic}
                    storiesAuthers={storiesAuthers}
                  />
                )}
                {Object.values(storiesObj).map(({ author, stories }) => {
                  const isViewed = !stories
                    .map((story) => story.storyViews)
                    .some((arr) => !arr.includes(user.id));

                  return (
                    <StoryItem
                      isViewed={isViewed}
                      key={author.id}
                      stories={stories}
                      username={author.username}
                      image={author.profilePic}
                      storiesAuthers={storiesAuthers}
                    />
                  );
                })}
              </>
            )}
          </>
        </Flex>
      </Box>
      {/* {storyModalOpen.opened && (
        <Story setStoryModalOpen={setStoryModalOpen} {...storyModalOpen} />
      )} */}
    </>
  );
};

export default Stories;
