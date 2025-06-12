import axios from "axios";

const githubAxiosInstance = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/vnd.github.v3+json",
  },
});

export default githubAxiosInstance;
