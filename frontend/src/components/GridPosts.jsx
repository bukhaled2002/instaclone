import { Box, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FaComment, FaHeart } from "react-icons/fa";
import PostModal from "./PostModal";
import { useLoaderData } from "react-router";

function GridPosts() {
  const [isOpenPostModal, setIsOpenPostModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const handleOpenModal = (postId) => {
    setSelectedPostId(postId);
    setIsOpenPostModal(true);
  };
  const { posts } = useLoaderData();
  console.log(posts);

  return (
    <>
      <Grid templateColumns="repeat(3, minmax(100px, 1fr))" gap={1} w={"100%"}>
        {posts.map((post) => (
          <GridItem key={post.id} onClick={() => handleOpenModal(post.id)}>
            <Box
              position="relative"
              overflow="hidden"
              _hover={{ cursor: "pointer" }}
            >
              <Box
                width="100%"
                height="0"
                paddingBottom="100%"
                position="relative"
              >
                <Image
                  src={post.img}
                  position="absolute"
                  top={0}
                  left={0}
                  h="100%"
                  w="100%"
                  objectFit="cover"
                />
                {/* Overlay */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  h="100%"
                  w="100%"
                  bgColor="rgba(0, 0, 0, 0.5)" // Semi-transparent background
                  opacity={0} // Start hidden
                  _hover={{ opacity: 1 }} // Show on hover
                  transition="opacity 0.3s" // Smooth transition
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white" // Text color
                  gap={"15px"}
                >
                  <Box
                    display={"flex"}
                    align={"center"}
                    justifyContent={"center"}
                    gap={"5px"}
                  >
                    <Text fontSize={"20px"} fontWeight={"bold"}>
                      {post.likes.length}
                    </Text>
                    <FaHeart fontSize={"25px"} />
                  </Box>
                  <Box
                    display={"flex"}
                    align={"center"}
                    justifyContent={"center"}
                    gap={"5px"}
                  >
                    <Text fontSize={"20px"} fontWeight={"bold"}>
                      {post.comments.length}
                    </Text>
                    <FaComment fontSize={"25px"} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </GridItem>
        ))}
      </Grid>
      {/* Post Modal */}
      {selectedPostId && (
        <PostModal
          postId={selectedPostId}
          isOpen={isOpenPostModal}
          onClose={() => {
            setIsOpenPostModal(false);
            setSelectedPostId(null);
          }}
        />
      )}
    </>
  );
}

export default GridPosts;
