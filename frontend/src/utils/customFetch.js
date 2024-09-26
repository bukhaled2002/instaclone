import axios from "axios";
import Cookies from "js-cookie";

const customFetch = axios.create({
  baseURL: "https://instaclone-backend-xsfg.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: "include", // Add this line to include credentials with requests
});

customFetch.interceptors.request.use((config) => {
  const authToken = Cookies.get("jwt");
  console.log(authToken);

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});
customFetch.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API call failed:", error.response || error.message);
    // Handle error appropriately here
    return Promise.reject(error);
  }
);
export default customFetch;
