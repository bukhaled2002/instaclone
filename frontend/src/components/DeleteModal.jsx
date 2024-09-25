import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  ModalFooter,
} from "@chakra-ui/react";

function DeleteModal({ isOpen, onClose, onDelete }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.dark" borderRadius="lg">
        <ModalHeader>
          <Text fontWeight="bold" fontSize="lg" color="red.500">
            Delete Post
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="outline" onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteModal;
