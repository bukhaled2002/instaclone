import {
  Box,
  Button,
  Flex,
  FormControl,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import customFetch from "../utils/customFetch";
import logo from "../assets/logo.svg";
import { login } from "../features/user/userSlice";

function SignupPage() {
  const toast = useToast();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    name: "",
    username: "",
    password: "",
  });
  console.log(input);
  const handleSignup = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const response = await customFetch.post(
        "/user/signup",
        JSON.stringify(input)
      );
      console.log(response.data);
      // Cookies.set("jwt", response.data.token);
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
      onSubmit={handleSignup}
      w={"350px"}
      border={"solid gray"}
      borderWidth={"0.5px"}
      py={"20px"}
      px={"50px"}
      mt={"125px"}
      mx={"auto"}
      textAlign={"center"}
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
          type="email"
          id="email"
          name="email"
          onChange={(e) => setInput({ ...input, email: e.target.value })}
          py={"6px"}
          bg={"gray.dark"}
          px={"10px"}
          placeholder="Email"
          border={"solid gray 0.2px"}
        />
        <Input
          type="text"
          bg={"gray.dark"}
          onChange={(e) => setInput({ ...input, name: e.target.value })}
          name="name"
          id="name"
          py={"6px"}
          px={"10px"}
          placeholder="Full Name"
          border={"solid gray 0.2px"}
        />
        <Input
          type="text"
          bg={"gray.dark"}
          name="username"
          id="username"
          onChange={(e) => setInput({ ...input, username: e.target.value })}
          py={"6px"}
          px={"10px"}
          placeholder="Username"
          border={"solid gray 0.2px"}
        />
        <Input
          type="password"
          onChange={(e) => setInput({ ...input, password: e.target.value })}
          bg={"gray.dark"}
          name="password"
          id="password"
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
        {!loading ? "Sign up" : <Spinner />}
      </Button>
      <Text fontSize={"12px"} color={"gray"} mt={"10px"}>
        Already have an account?
        <Text
          display={"inline"}
          ml={"5px"}
          color={"brand.primary"}
          fontWeight={"semibold"}
        >
          <Link to={"/signin"}>Login</Link>
        </Text>
      </Text>
    </FormControl>
  );
}

export default SignupPage;
