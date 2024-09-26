import {
  Box,
  Button,
  Flex,
  FormControl,
  Image,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import Cookies from "js-cookie";

import { Link, useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/user/userSlice";
import logo from "../assets/logo.svg";
function SigninPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    emailOrUsername: "",
    password: "",
  });
  console.log(input);
  const handleSignin = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const response = await customFetch.post(
        "/user/signin",
        JSON.stringify(input)
      );
      // Cookies.set("jwt", response?.data?.token, {
      //   secure: true,
      //   httpOnly: true,
      // });
      toast({
        status: "success",
        description: "signed up successfully",
        duration: 3000,
        isClosable: true,
      });
      dispatch(login(response.data.data.user));
      navigate("/");
    } catch (error) {
      toast({
        status: "error",
        description: error?.response?.data?.message,
        duration: 3000,
        isClosable: true,
      });

      return null;
    } finally {
      setLoading(false);
    }
  };
  return (
    <FormControl
      as={"form"}
      w={"350px"}
      border={"solid gray"}
      borderWidth={"0.5px"}
      py={"50px"}
      px={"50px"}
      mt={"150px"}
      mx={"auto"}
      textAlign={"center"}
      onSubmit={handleSignin}
    >
      <Box m={"auto"}>
        <Image src={logo} w={"200px"} m={"auto"} />
        <Text fontWeight={"semibold"} color={"gray"}>
          Sign up to see photos and videos from your friends.
        </Text>
      </Box>
      <Flex
        direction={"column"}
        gap={"10px"}
        mt={"30px"}
        w={"100%"}
        fontSize={"14px"}
      >
        <Input
          type="text"
          name="emailOrUsername"
          onChange={(e) =>
            setInput({ ...input, emailOrUsername: e.target.value })
          }
          py={"6px"}
          bg={"gray.dark"}
          px={"10px"}
          placeholder="Email or username"
          border={"solid gray 0.2px"}
        />
        <Input
          type="password"
          bg={"gray.dark"}
          name="password"
          id="password"
          onChange={(e) => setInput({ ...input, password: e.target.value })}
          py={"6px"}
          px={"10px"}
          placeholder="Password"
          border={"solid gray 0.2px"}
        />

        <Text fontSize={"12px"} color={"gray"} mt={"10px"}>
          By signing up, you agree to our Terms , Privacy Policy and Cookies
          Policy .
        </Text>
      </Flex>
      <Button
        size={"sm"}
        w={"100%"}
        mt={"10px"}
        type="submit"
        disabled={loading}
        opacity={loading ? "70%" : 1}
      >
        {!loading ? "Signin" : <Spinner />}
      </Button>
      <Text fontSize={"12px"} color={"gray"} mt={"10px"}>
        Don't have an account?
        <Link to={"/signup"}>
          <Text
            display={"inline"}
            ml={"5px"}
            color={"brand.primary"}
            fontWeight={"semibold"}
          >
            Signup
          </Text>
        </Link>
      </Text>
    </FormControl>
  );
}

export default SigninPage;
