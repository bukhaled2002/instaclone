import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router";
import { useDispatch } from "react-redux";
import usePreviewImg from "../hooks/usePreviewImg";
import { updateUser } from "../features/user/userSlice";
export const loader = async () => {
  const response = await customFetch("user/getMe");
  return response.data;
};
function SettingPage() {
  const { user } = useLoaderData();
  console.log(user.bio);
  const [isLoading, setIsLoading] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg(
    user.profilePic
  );
  const dispatch = useDispatch();
  const inputRef = useRef();
  const toast = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await customFetch.patch(
        "/user/updateMe",
        JSON.stringify({ profilePic: imgUrl, bio })
      );
      dispatch(updateUser(response.data.user));
      toast({ title: "success", description: "Profile updated successfull" });
    } catch (error) {
      toast({ title: "error", description: "Cannot update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      flexDirection={"column"}
      gap={"15px"}
      mt={{ base: "60px", md: "40px" }}
    >
      <Heading size={"xl"}>Edit Profile</Heading>
      <Flex
        gap={"20px"}
        flexDirection={"column"}
        mt={"30px"}
        as={"form"}
        onSubmit={handleSubmit}
      >
        <Flex
          gap={"10px"}
          bg={"#282828"}
          p={"15px"}
          borderRadius={"20px"}
          align={"center"}
        >
          <Avatar src={imgUrl || user.profilePic} />
          <Box flex={1}>
            <Text
              fontSize={"20px"}
              letterSpacing={"1px"}
              fontWeight={"semibold"}
            >
              {user.username}
            </Text>
            <Text fontSize={"14px"} color={"gray"}>
              {user.name}
            </Text>
          </Box>
          <Button size={"sm"} onClick={() => inputRef.current.click()}>
            Change photo
          </Button>
          <Input
            type="file"
            hidden
            ref={inputRef}
            onChange={handleImageChange}
          />
        </Flex>
        <Heading fontSize={"23px"}>Bio</Heading>
        <Textarea
          bg={"#282828"}
          placeholder="Add something in your mid"
          onChange={(e) => setBio(e.target.value)}
          defaultValue={bio}
        ></Textarea>
        <Button
          type="submit"
          alignSelf={"end"}
          disabled={isLoading}
          gap={"10px"}
        >
          {isLoading ? (
            <>
              Submitting <Spinner />
            </>
          ) : (
            "submit"
          )}
        </Button>
      </Flex>
    </Container>
  );
}

export default SettingPage;
