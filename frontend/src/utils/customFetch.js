import axios from "axios";
import Cookies from "js-cookie";

const customFetch = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Add this line to include credentials with requests
});

customFetch.interceptors.request.use((config) => {
  const authToken = Cookies.get("jwt");
  console.log(authToken);

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default customFetch;
