import {
  Avatar,
  Button,
  Flex,
  GridItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { GrInstagram } from "react-icons/gr";
import { IoSearchSharp } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { TbVideoPlus } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineAddBox } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { TbBrandMessenger } from "react-icons/tb";
import { TiHome } from "react-icons/ti";
import { GoHome } from "react-icons/go";
import { useSelector } from "react-redux";
import CreatePost from "./CreatePost";
import { Link, NavLink } from "react-router-dom";
import React, { useState } from "react";
import CreateStory from "./CreateStory";
import SidbarSearch from "./SidebarSearch";
import SidebarSearch from "./SidebarSearch";
function Sidebar() {
  const [openSidebarSearch, setOpenSidebarSearch] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useSelector((state) => state.user);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(onClose);
    return onClose();
  };
  const handleAddPost = async (newContent) => {};
  return (
    <Flex
      h={{ base: "auto", md: "100vh" }}
      position={"fixed"}
      width={{ base: "100%", md: "auto" }}
      bg={"black"}
      top={{ base: "unset", md: 0 }}
      bottom={{ base: 0, md: "unset" }}
      left={0}
      zIndex={2}
      borderRight={{ base: "none", md: "solid 0.5px gray" }}
      borderTop={{ base: "solid 0.5px gray", md: "none" }}
      // alignItems={"start"}
    >
      <Flex
        as={"ul"}
        width={{ base: "100%", md: "auto" }}
        direction={{ base: "row", md: "column" }}
        alignItems={"start"}
        display={"flex"}
        fontSize={"26px"}
        gap={{ base: "unset", md: "70px" }}
        py={"10px"}
      >
        <Button
          as={Link}
          to={"/"}
          w={"100%"}
          bg={"transparent"}
          display={{ base: "none", md: "flex" }}
          alignItems={"center"}
          gap={"25px"}
          justifyContent={"start"}
        >
          <GrInstagram fontSize={"24px"} />
          <Text display={{ base: "none", lg: "block" }}>Instagram</Text>
        </Button>
        <Flex
          // direction={{ base: "row", sm: "column" }}
          direction={{ base: "row", md: "column" }}
          flex={1}
          align={"center"}
          justifyContent={"space-around"}
          py={"5px"}
          position={"static"}
        >
          {/* <TiHome /> */}
          <Button
            as={NavLink}
            to={"/"}
            w={"100%"}
            bg={"transparent"}
            display={"flex"}
            alignItems={"center"}
            gap={"25px"}
            justifyContent={{ base: "center", md: "start" }}
          >
            <GoHome fontSize={"28px"} />
            <Text
              _activeLink={{ fontWeight: "bold" }}
              display={{ base: "none", lg: "block" }}
              w={"120px"}
            >
              Home
            </Text>
          </Button>
          <Button
            bg={"transparent"}
            w={"100%"}
            justifyContent={{ base: "center", md: "start" }}
            gap={"25px"}
            display={{ base: "none", md: "flex" }}
            alignItems={"center"}
            onClick={() => setOpenSidebarSearch(!openSidebarSearch)}
          >
            <IoSearchSharp fontSize={"26px"} />
            <Text display={{ base: "none", lg: "block" }}>Search</Text>
          </Button>
          {openSidebarSearch && <SidebarSearch />}
          <Button
            as={NavLink}
            to={"/explore"}
            w={"100%"}
            bg={"transparent"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={{ base: "center", md: "start" }}
            gap={"25px"}
          >
            <MdOutlineExplore fontSize={"26px"} />
            <Text display={{ base: "none", lg: "block" }}>Explore</Text>
          </Button>

          <Button
            as={NavLink}
            to={"/record"}
            w={"100%"}
            bg={"transparent"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={{ base: "center", md: "start" }}
            gap={"25px"}
          >
            <TbVideoPlus fontSize={"26px"} />
            <Text display={{ base: "none", lg: "block" }}>Reels</Text>
          </Button>
          <Button
            as={NavLink}
            to={"/messages"}
            bg={"transparent"}
            w={"100%"}
            display={{ base: "none", md: "flex" }}
            alignItems={"center"}
            justifyContent={{ base: "center", md: "start" }}
            gap={"25px"}
          >
            <TbBrandMessenger fontSize={"26px"} />
            <Text display={{ base: "none", lg: "block" }}>Messages</Text>
          </Button>
          <Button
            as={NavLink}
            w={"100%"}
            bg={"transparent"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={{ base: "center", md: "start" }}
            gap={"25px"}
          >
            <FaRegHeart fontSize={"26px"} />
            <Text display={{ base: "none", lg: "block" }}>Notifications</Text>
          </Button>
          <Menu>
            <MenuButton w={"100%"}>
              <Button
                w={"100%"}
                bg={"transparent"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={{ base: "center", md: "start" }}
                gap={"25px"}
                width={"100%"}
              >
                <MdOutlineAddBox fontSize={"26px"} />
                <Text display={{ base: "none", lg: "block" }}>Create</Text>
              </Button>
              {/* <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <CreatePost onClose={onClose} />
              </Modal> */}
            </MenuButton>

            <MenuList bg={"gray.dark"} left={"0"}>
              <MenuItem
                bg={"gray.dark"}
                fontSize={"15px"}
                _hover={{ bg: "#7676766e" }}
                onClick={() => setIsCreatePostModalOpen(true)}
              >
                Create Post
              </MenuItem>
              <MenuItem
                bg={"gray.dark"}
                fontSize={"15px"}
                _hover={{ bg: "#7676766e" }}
                onClick={() => setIsCreateStoryModalOpen(true)}
              >
                Create Story
              </MenuItem>
            </MenuList>
          </Menu>
          <CreatePost
            isOpen={isCreatePostModalOpen}
            onClose={() => setIsCreatePostModalOpen(false)}
          />
          <CreateStory
            isOpen={isCreateStoryModalOpen}
            onClose={() => setIsCreateStoryModalOpen(false)}
          />
          <Button
            as={NavLink}
            to={`/profile/${user.username}`}
            w={"100%"}
            bg={"transparent"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={{ base: "center", md: "start" }}
            gap={"25px"}
          >
            <Avatar src={user.profilePic} h={"30px"} w={"30px"} />
            <Text display={{ base: "none", lg: "block" }}>Profile</Text>
          </Button>
        </Flex>
        <Menu>
          <MenuButton width={{ base: "fit-content", md: "100%" }}>
            <Button
              w={"100%"}
              bg={"transparent"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={{ base: "center", md: "start" }}
              gap={"25px"}
            >
              <GiHamburgerMenu fontSize={"25px"} />
              <Text display={{ base: "none", lg: "block" }}>More</Text>
            </Button>
          </MenuButton>

          <MenuList bg={"gray.dark"} left={"0"}>
            <MenuItem
              bg={"gray.dark"}
              fontSize={"15px"}
              _hover={{ bg: "#7676766e" }}
            >
              Logout
            </MenuItem>
            <MenuItem
              bg={"gray.dark"}
              fontSize={"15px"}
              _hover={{ bg: "#7676766e" }}
            >
              Edit Profile
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}

export default Sidebar;
