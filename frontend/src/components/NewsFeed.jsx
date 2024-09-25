import React, { useCallback, useEffect, useState } from "react";
import customFetch from "../utils/customFetch";
import {
  Box,
  Container,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import Post from "./Post";
import Stories from "./Stories";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../features/user/postsSlice";
import { Outlet } from "react-router";
import { updateStories } from "../features/user/userSlice";

function NewsFeed() {
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await customFetch(`/story/${user.username}`);
        dispatch(updateStories(response.data.stories));
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };
    fetchStory();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      dispatch(setPosts([]));
      try {
        const response = await customFetch.get("/post/newsfeed");
        if (response.error) {
          return;
        }
        dispatch(setPosts(response.data.posts));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [dispatch]);

  return (
    <>
      <Container
        display={"flex"}
        flexDirection={"column"}
        gap={"15px"}
        mt={{ base: "30px", md: "0px" }}
      >
        <Stories />

        {loading ? (
          <>
            {[1, 2, 3, 4].map((el) => {
              return (
                <Box padding="6" boxShadow="lg" key={el}>
                  <SkeletonCircle size="14" />

                  <Skeleton height="350px" mt={"10px"} />
                  <SkeletonText
                    mt="4"
                    noOfLines={2}
                    spacing="4"
                    skeletonHeight="2"
                  />
                </Box>
              );
            })}
          </>
        ) : (
          <>
            {posts.length <= 0 ? (
              <Text>no posts found, follow people to watch their posts</Text>
            ) : (
              posts.map((post) => {
                return <Post key={post.id} post={post} />;
              })
            )}
          </>
        )}
      </Container>
    </>
  );
}

export default NewsFeed;
