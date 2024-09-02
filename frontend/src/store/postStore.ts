import { create } from "zustand";
import axios from "axios";

interface Post {
  video: string;
  description: string;
}

interface PostState {
  posts: Post[]; // Updated to store a list of posts
  post: Post | null; // Individual post
  error: string | null;
  isLoading: boolean;
}

interface PostActions {
  newPost: (video: string, description: string) => Promise<void>;
  getPost: (postId: string) => Promise<void>;
  getPosts: () => Promise<void>; // New action to fetch multiple posts
}

type PostStore = PostState & PostActions;

const API_POST_URL = "http://localhost:3000/api/post";

axios.defaults.withCredentials = true;

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  post: null,
  error: null,
  isLoading: false,

  newPost: async (video, description) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_POST_URL}/create`, {
        video,
        description,
      });
      set({ post: response.data, error: null });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, post: null });
    } finally {
      set({ isLoading: false });
    }
  },

  getPost: async (postId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_POST_URL}/${postId}`);
      set({ post: response.data, error: null });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, post: null });
    } finally {
      set({ isLoading: false });
    }
  },

  getPosts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(API_POST_URL);
      set({ posts: response.data.posts, error: null });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMessage, posts: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));
