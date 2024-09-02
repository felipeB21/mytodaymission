import { useEffect, useRef, useState } from "react";
import { usePostStore } from "../store/postStore";
import Like from "./icons/Like";
import { Button } from "@nextui-org/react";
import Message from "./icons/Message";
import Share from "./icons/Share";

// Define the structure of a post
interface Post {
  videoUrl: string;
  description: string;
}

// Define the structure of the store state
interface StoreState {
  getPosts: () => void;
  posts: Post[];
  isLoading: boolean;
  error: string | null;
}

export default function ReelsPage() {
  const { getPosts, posts, isLoading, error } = usePostStore(
    (state: StoreState) => ({
      getPosts: state.getPosts,
      posts: state.posts,
      isLoading: state.isLoading,
      error: state.error,
    })
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target as HTMLVideoElement;
            setActiveIndex(videoRefs.current.indexOf(video));
            if (isPlaying) {
              video.play();
            }
          } else {
            (entry.target as HTMLVideoElement).pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observerRef.current?.observe(video);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [posts, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    const currentVideo = videoRefs.current[activeIndex];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause();
      } else {
        currentVideo.play();
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        Error: {error}
      </div>
    );

  return (
    <div className="bg-black min-h-screen text-white">
      {posts.length === 0 ? (
        <p className="text-center py-10">No reels available.</p>
      ) : (
        <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
          {posts.map((post: Post, index: number) => (
            <div
              key={index}
              className="snap-start h-screen w-full flex items-center justify-center relative"
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={post.videoUrl}
                className="h-full w-full object-cover"
                loop
                playsInline
                muted={activeIndex !== index}
                onClick={togglePlayPause}
              />
              <Button
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 rounded-full p-4"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-12 w-12 text-white"
                  >
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-12 w-12 text-white"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
                <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
              </Button>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <p className="text-lg font-semibold mb-2">{post.description}</p>
                <div className="flex items-center space-x-4">
                  <Button>
                    <Like />
                  </Button>
                  <Button>
                    <Message />
                  </Button>
                  <Button>
                    <Share />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
