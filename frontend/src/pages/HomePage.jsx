import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import { Outlet, useLocation } from "react-router";
import Sidebar from "../components/Sidebar";
import { Box, Flex } from "@chakra-ui/react";
import customFetch from "../utils/customFetch";
import { login, updateUser } from "../features/user/userSlice";
import { useEffect } from "react";
import Suggestion from "../components/Suggestion";
function HomePage() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetch = async () => {
      const response = await customFetch("/user/getMe");
      console.log("1", response.data.user);
      dispatch(updateUser(response.data.user));
    };
    fetch();
  }, [dispatch]);
  const { pathname } = useLocation();
  console.log(pathname);

  return (
    <>
      <Header />
      <Flex>
        <Box>
          <Sidebar />
        </Box>

        <Box
          overflowY={"auto"}
          flex={1}
          mt={{ base: "50px", md: "0px" }}
          width={{ base: "350px", sm: "500px", md: "900px" }}
        >
          <Outlet />
        </Box>

        {pathname === "/" && (
          <Box>
            <Box display={{ base: "none", xl: "block" }} w={"400px"}>
              <Suggestion />
            </Box>
          </Box>
        )}
      </Flex>
    </>
  );
}

export default HomePage;
