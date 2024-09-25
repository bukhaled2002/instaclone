import {
  MenuList,
  MenuItem,
  MenuButton,
  Menu,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import customFetch from "../utils/customFetch";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../features/user/postsSlice";
import EditPostModal from "./EditPostModal";

function MenuComponent({ user, author, post }) {
  const { posts } = useSelector((state) => state.posts);
  const [postContent, setPostContent] = useState(post.content);
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const copyPostUrl = () => {
    console.log(window.location.origin);

    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
  };
  const handleSave = async (newContent) => {
    const response = await customFetch.patch(`/post/${post.id}`, {
      content: newContent,
    });
    const newPosts = posts.map((p) => {
      if (p.id === post.id) {
        return { ...p, content: newContent };
      }
      return p;
    });
    dispatch(setPosts(newPosts));
    toast({ status: "success", title: "post edited successfull" });
  };

  const handleDelete = async () => {
    try {
      const response = await customFetch.delete(`/post/${post.id}`);

      let newPosts = posts.filter((p) => p.id !== post.id);

      dispatch(setPosts(newPosts));
      toast({ status: "success", title: "Post deleted successfully" });
      navigate("/");
    } catch (error) {
      console.log(error);
      toast({ status: "error", title: error.response.data.message });
    } finally {
      setIsOpenDeleteModal(false);
    }
  };

  return (
    <>
      <Menu bg={"white"}>
        <MenuButton as={"button"}>...</MenuButton>

        <MenuList bg={"gray.dark"} right={0} className="element">
          {user.id === author.id && (
            <>
              <MenuItem
                bg={"gray.dark"}
                _hover={{ bg: "#7676766e" }}
                onClick={() => setIsOpenDeleteModal(true)}
              >
                Delete
              </MenuItem>
              <MenuItem
                bg={"gray.dark"}
                _hover={{ bg: "#7676766e" }}
                onClick={() => setIsOpenEditModal(true)}
              >
                Edit
              </MenuItem>
            </>
          )}
          <MenuItem
            bg={"gray.dark"}
            _hover={{ bg: "#7676766e" }}
            onClick={() => copyPostUrl()}
          >
            Copy link
          </MenuItem>
          <MenuItem bg={"gray.dark"} _hover={{ bg: "#7676766e" }}>
            Send to
          </MenuItem>
        </MenuList>
      </Menu>
      <DeleteModal
        isOpen={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        onDelete={handleDelete}
      />
      <EditPostModal
        isOpen={isOpenEditModal}
        onClose={() => setIsOpenEditModal(false)}
        post={post}
        onSave={handleSave}
      />
    </>
  );
}

export default MenuComponent;
