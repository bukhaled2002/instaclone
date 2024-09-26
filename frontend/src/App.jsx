import { Container } from "@chakra-ui/react";
import { Navigate, RouterProvider } from "react-router";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import NewsFeed from "./components/NewsFeed";
import { useSelector } from "react-redux";
import PostPage from "./pages/PostPage";
import ProfilePage, { loader as profileloader } from "./pages/ProfilePage";
import ErrorPage from "./pages/ErrorPage";
import { createBrowserRouter } from "react-router-dom";
import SettingPage, { loader as settingLoader } from "./pages/SettingPage";
import MessagesPage, { loader as messageLoader } from "./pages/MessagesPage";
import Cookies from "js-cookie";

import StoriesPage, {
  loader,
  loader as storyLoader,
} from "./pages/StoriesPage";
import { store } from "./store";

function App() {
  console.log("jwt", Cookies.get());
  const { user } = useSelector((state) => state.user);
  const router = createBrowserRouter([
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: "/signin",
      element: <SigninPage />,
    },
    {
      path: "/",
      element: user ? <HomePage /> : <Navigate to="/signin" />,
      errorElement: <ErrorPage />,
      // loader: HomeLoader(store),
      children: [
        {
          index: true,
          element: <NewsFeed />,
        },
        {
          path: "post/:pId",
          element: <PostPage />,
        },
        {
          path: "profile/:username",
          element: <ProfilePage />,
          loader: profileloader,
          errorElement: <ErrorPage />,
        },
        {
          path: "setting",
          element: <SettingPage />,
          loader: settingLoader,
          errorElement: <ErrorPage />,
        },
      ],
    },
    {
      path: "/messages/:participantId?",
      element: <MessagesPage />,
      loader: messageLoader,
    },
    {
      path: "/stories/:username/:storyId?",
      element: <StoriesPage />,
      loader: storyLoader,
    },
  ]);

  return (
    <RouterProvider router={router}></RouterProvider>
    // <Container
    //   width={
    //     pathname === "/" ? { base: "350px", sm: "500px", md: "900px" } : "620px"
    //   }
    // >

    // </Container>
  );
}

export default App;
