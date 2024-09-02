import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { User, Link, Skeleton, Card, CardBody } from "@nextui-org/react";

export default function UserPage() {
  const { username } = useParams<{ username: string }>();
  const { findUser, viewedUser, isLoading, error } = useAuthStore();

  useEffect(() => {
    if (username) {
      findUser(username);
    }
  }, [username, findUser]);

  useEffect(() => {
    if (viewedUser?.username) {
      document.title = `${viewedUser.username} - MyTodayMission`;
    } else if (username) {
      document.title = `${username} - MyTodayMission`;
    } else {
      document.title = "User Profile - MyTodayMission";
    }
  }, [viewedUser, username]);

  if (isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center p-6">
        <Skeleton className="rounded-full w-32 h-32 mx-auto mb-4" />
        <Skeleton className="h-6 w-[200px] mx-auto rounded-lg my-4" />
        <Skeleton className="h-4 w-[300px] mx-auto rounded-lg" />
      </Card>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-red-500 text-xl">{error}</div>;
  }

  if (!viewedUser) {
    return <div className="text-center p-8 text-xl">User not found</div>;
  }

  return (
    <Card className="flex items-center justify-center">
      <CardBody className="flex items-center justify-center p-8">
        <User
          name={viewedUser.name}
          description={
            <Link href={`/profile/${viewedUser.username}`} size="lg">
              @{viewedUser.username}
            </Link>
          }
          avatarProps={{
            src: viewedUser.avatar || undefined,
            name: viewedUser.name,
            showFallback: true,
            size: "lg",
            className: "w-32 h-32 text-large",
          }}
          classNames={{
            base: "flex flex-col items-center",
            wrapper: "flex-col items-center",
            name: "text-2xl font-bold mt-4 text-center",
            description: "text-lg text-center",
          }}
        />
      </CardBody>
    </Card>
  );
}
