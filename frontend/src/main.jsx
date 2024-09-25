import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/theme-utils";
import { ColorModeScript } from "@chakra-ui/color-mode";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./store.js";
import { PersistGate } from "redux-persist/integration/react";
import { SocketContextProvider } from "./context/SocketContext.jsx";
const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("white", "#101010")(props),
      fontFamily: "Inter, sans-serif",
    },
  }),
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};
const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
  brand: {
    primary: "#E1306c",
    secondary: "#405de6",
  },
};
const components = {
  Button: {
    baseStyle: {
      fontWight: "bold",
      borderRadius: "10px",
      _hover: {
        opacity: 0.8,
      },
    },
    variants: {
      solid: (props) => ({
        bg: mode("brand.primary", "brand.secondary")(props),
        color: "white",
      }),
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: "bold",
    },
  },
  Input: (props) => ({
    baseStyle: {
      borderRadius: "10px",
      borderColor: mode("gray.300", "gray.600")(props),
      _focus: {
        borderColor: "brand.primary",
        boxShadow: "0 0 0 1px brand.primary",
      },
    },
  }),
  Menu: {
    baseStyle: {
      list: {
        bg: "gray.800", // Background color for the menu
        color: "white", // Text color
      },
    },
    variants: {
      solid: {
        bg: "black", // Background color for solid variants
        color: "gray.300", // Text color for solid variants
        _hover: {
          bg: "gray.700", // Background color on hover
        },
      },
    },
  },
  MenuItem: {
    baseStyle: {
      _hover: {
        bg: "gray.600", // Background color on hover for menu items
      },
    },
  },
};
const theme = extendTheme({ config, styles, colors, components });
const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </ChakraProvider>
    </PersistGate>
  </Provider>
);
