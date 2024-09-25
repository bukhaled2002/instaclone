import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";

function PostSkelton() {
  return (
    <Modal isOpen={true} isCentered>
      <ModalOverlay />
      <ModalContent bg="black" color="white">
        <ModalCloseButton top={"-30px"} right={"-30px"} />
        <ModalBody p={0}>
          <Flex flexDirection={{ base: "column", md: "row" }}>
            <Box
              flex={1}
              display={"flex"}
              maxH={{ base: "300px", md: "unset" }}
            >
              <Skeleton w={"100%"} objectFit={"contain"} h={"300px"} />
            </Box>
            <Flex flex={1} flexDirection={"column"}>
              <Flex
                borderBottom={"solid 0.5px gray"}
                w={"100%"}
                p={"10px"}
                justifyContent={"space-between"}
              ></Flex>
              <Flex
                direction={"column"}
                maxH={{ base: "30vh", md: "70vh" }}
                p={"10px"}
                gap={"25px"}
              >
                <SkeletonText h={"10px"} />
                <SkeletonText h={"10px"} />
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PostSkelton;
