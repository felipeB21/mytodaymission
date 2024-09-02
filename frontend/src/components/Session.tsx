import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Skeleton,
  Spinner,
} from "@nextui-org/react";
import toast from "react-hot-toast";

export default function Session() {
  const { me, isAuthenticated, currentUser, isCheckingAuth, logout } =
    useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    me();
  }, [me]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("There was an error logging out. Please try again.");
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div>
        <Skeleton className="flex rounded-full w-10 h-10" />
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              showFallback
              name={currentUser?.name}
              src={currentUser?.avatar}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem
              key="settings"
              href={`/profile/${currentUser?.username}`}
            >
              My Profile
            </DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem
              key="logout"
              className="text-danger"
              color="danger"
              onClick={handleLogout}
            >
              {isLoggingOut ? (
                <>
                  <Spinner size="sm" color="danger" />
                  <span className="ml-2">Logging out...</span>
                </>
              ) : (
                "Log Out"
              )}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <div className="flex items-center gap-4">
          <Button color="primary" as="a" href="/auth/login">
            <p className="font-medium">Log in</p>
          </Button>
          <a className="font-medium" href="/auth/register">
            Register
          </a>
        </div>
      )}
    </>
  );
}
