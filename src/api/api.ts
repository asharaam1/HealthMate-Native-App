import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate } from "../navigation/RootNavigation";

const API_URL: string = Config.API_URL || "http://10.0.2.2:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      // Use the AxiosHeaders API
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(["token", "user"]);
      navigate("Login"); // Redirect to AuthStack Login
    }
    return Promise.reject(error);
  }
);

export default api;