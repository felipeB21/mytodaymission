import { create } from "zustand";
import axios from "axios";

interface Followers {
  username: string;
  avatar?: string;
}

interface Likes {
  username: string;
  avatar?: string;
}

interface Comments {
  _id: string;
  text: string;
}

interface Posts {
  _id: string;
  videoUrl: string;
  description: string;
  likes: Likes;
  comments: Comments;
}

interface User {
  email: string;
  name: string;
  username: string;
  avatar?: string;
  followers: Followers;
  followerCount: number;
  postCount: number;
  posts: Posts[];
}

interface AuthState {
  currentUser: User | null;
  viewedUser: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
}

interface AuthActions {
  signup: (
    email: string,
    password: string,
    name: string,
    username: string,
    avatar?: string
  ) => Promise<void>;
  me: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  findUser: (username: string) => Promise<void>;
  logout: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

const API_AUTH_URL = "http://localhost:3000/api/auth";
const API_USERS_URL = "http://localhost:3000/api/users";

axios.defaults.withCredentials = true;

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,
  viewedUser: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (email, password, name, username, avatar) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_AUTH_URL}/register`, {
        email,
        password,
        name,
        username,
        avatar,
      });
      set({
        currentUser: response.data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error?.response?.data?.message || "Error signing up",
          isLoading: false,
        });
        throw error;
      } else {
        set({ error: "An unexpected error occurred", isLoading: false });
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_AUTH_URL}/login`, {
        email,
        password,
      });
      set({
        currentUser: response.data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error?.response?.data?.message || "Error signing in",
          isLoading: false,
        });
        throw error;
      } else {
        set({ error: "An unexpected error occurred", isLoading: false });
      }
    }
  },

  me: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_AUTH_URL}/me`);
      set({
        currentUser: response.data.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: null,
          isCheckingAuth: false,
          isAuthenticated: false,
        });
      } else {
        set({
          error: null,
          isCheckingAuth: false,
          isAuthenticated: false,
        });
      }
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_AUTH_URL}/logout`);
      set({
        currentUser: null,
        viewedUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error?.response?.data?.message || "Error logging out",
          isLoading: false,
        });
      } else {
        set({ error: "An unexpected error occurred", isLoading: false });
      }
    }
  },

  findUser: async (username: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_USERS_URL}/${username}`);
      set({
        viewedUser: response.data.data.user,
        isLoading: false,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          set({
            viewedUser: null,
            error: "User not found",
            isLoading: false,
          });
        } else {
          set({
            error: error?.response?.data?.message || "Error finding user",
            isLoading: false,
          });
        }
      } else {
        set({ error: "An unexpected error occurred", isLoading: false });
      }
    }
  },
}));
