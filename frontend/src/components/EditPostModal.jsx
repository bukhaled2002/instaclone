import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  Textarea,
  Image,
  Box,
  Flex,
} from "@chakra-ui/react";

function EditModal({ isOpen, onClose, post, onSave }) {
  const [content, setContent] = useState(post.content);

  const handleSave = () => {
    onSave(content);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="gray.dark"
        color="white"
        maxW={{ base: "90%", sm: "70%", md: "620px", lg: "780px" }}
      >
        <ModalBody p={0}>
          <Flex
            // minH={{base:'"400px"}}
            flexDirection={{ base: "column", md: "row" }}
            h={"100%"}
          >
            <Box flex={1}>
              <Box flex={1} display={"flex"}>
                <Image src={post.img} w={"100%"} objectFit={"contain"} />
              </Box>
            </Box>
            <Box
              flex={1}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
            >
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                bg="gray.dark"
                color="white"
                resize="none"
                border={"none"}
              />
              <ModalFooter>
                <Button colorScheme="blue" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="outline" onClick={onClose} ml={3}>
                  Cancel
                </Button>
              </ModalFooter>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default EditModal;
