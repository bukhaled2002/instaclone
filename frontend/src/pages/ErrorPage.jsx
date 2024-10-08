import { Button, Container, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

function ErrorPage() {
  console.log("assa");

  return (
    <Container>
      <Flex
        h={"100vh"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"}
        gap={"20px"}
      >
        <Text fontWeight={"semibold"}>
          This Page is not defined yet, got to home page
        </Text>
        <Button borderRadius={"md"} as={Link} to={"/"}>
          Home page
        </Button>
      </Flex>
    </Container>
  );
}

export default ErrorPage;
