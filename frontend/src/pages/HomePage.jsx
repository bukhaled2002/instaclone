import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import { Box, Flex } from "@chakra-ui/react";
import customFetch from "../utils/customFetch";
import { login, updateUser } from "../features/user/userSlice";
import { useEffect } from "react";
function HomePage() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetch = async () => {
      const response = await customFetch("/user/getMe");
      console.log("1", response.data.user);
      dispatch(updateUser(response.data.user));
    };
    fetch();
  }, []);
  return (
    <>
      <Header />
      <Flex>
        <Box>
          <Sidebar />
        </Box>
        <Box
          flex={1}
          mt={{ base: "50px", md: "0px" }}
          width={{ base: "350px", sm: "500px", md: "900px" }}
        >
          <Outlet />
        </Box>
        {/* <Box>
          suggetsions
          <Box display={{ base: "none", md: "block" }} bg={"red"}>
            sa
          </Box>
        </Box> */}
      </Flex>
    </>
  );
}

export default HomePage;
