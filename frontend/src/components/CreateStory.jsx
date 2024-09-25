import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../utils/customFetch";
import { setPosts } from "../features/user/postsSlice";
import usePreviewImg from "../hooks/usePreviewImg";
import { addStory } from "../features/user/userSlice";
// import { addStory } from "../../../backend/controllers/storyController";
function CreateStory({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const toast = useToast();
  const dispatch = useDispatch();
  const btnRef = useRef(null);
  const ref = useRef();
  const { handleImageChange, setImgUrl, imgUrl } = usePreviewImg();
  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const response = await customFetch.post(
        "/story/addStory",
        JSON.stringify({ media: imgUrl })
      );

      console.log(response.data.story);
      dispatch(addStory(response.data.story));
      toast({ status: "success", title: "story uploaded successfull" });
      setImgUrl("");
      setLoading(false);
      btnRef.current.click();
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast({ status: "error", title: "cannot add post" });
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent
        as={"form"}
        bg={"#262626"}
        h={"fit-content"}
        onSubmit={handleSubmit}
      >
        <ModalCloseButton ref={btnRef} hidden={imgUrl} />
        {!imgUrl ? (
          <>
            <ModalHeader
              borderBottom={"solid 0.25px gray"}
              textAlign={"center"}
              fontSize={"16px"}
            >
              Create new post
            </ModalHeader>
          </>
        ) : (
          <ModalHeader
            display={"flex"}
            gap={"20px"}
            justifyContent={"space-between"}
            fontSize={"15px"}
          >
            <Text
              onClick={() => setImgUrl(null)}
              cursor={"pointer"}
              color={"brand.secondary"}
            >
              back
            </Text>
            <Text flex={1}>Create new story </Text>
          </ModalHeader>
        )}

        <ModalBody
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          cursor={"pointer"}
          onClick={() => ref.current.click()}
        >
          <Input type="file" hidden ref={ref} onChange={handleImageChange} />

          {!imgUrl ? (
            <>
              <Flex
                direction={"column"}
                alignItems={"center"}
                justify={"center"}
                h={"500px"}
              >
                <Text>Add photo of video</Text>
                <MdOutlineAddPhotoAlternate fontSize={"100px"} />
              </Flex>
            </>
          ) : (
            <Image src={imgUrl} h={"500px"} />
          )}
        </ModalBody>
        <Box
          p={"20px"}
          display={"flex"}
          gap={"10px"}
          justifyContent={"space-between"}
        >
          <Avatar src={user.profilePic} />

          <Button
            type="submit"
            disabled={loading}
            cursor={loading ? "progress" : "pointer"}
            opacity={loading ? "20%" : "1"}
          >
            {!loading ? "share" : "loading ..."}
          </Button>
        </Box>
      </ModalContent>
    </Modal>
  );
}
export default CreateStory;
