import { useEffect } from "react";
import { usePostStore } from "../store/postStore";

export default function HeroPage() {
  const { getPosts, posts, isLoading, error } = usePostStore((state) => ({
    getPosts: state.getPosts,
    posts: state.posts,
    isLoading: state.isLoading,
    error: state.error,
  }));

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>HeroPage</h1>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <ul>
          {posts.map((post, index) => (
            <li key={index}>
              <p>{post.description}</p>
              <video src={post.video} controls />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
