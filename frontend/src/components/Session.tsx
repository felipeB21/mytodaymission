import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Skeleton,
} from "@nextui-org/react";

export default function Session() {
  const { me, isAuthenticated, currentUser, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    me();
  }, [me]);

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
              as="a"
              href={`/profile/${currentUser?.username}`}
            >
              My Profile
            </DropdownItem>
            <DropdownItem key="configurations">Configurations</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
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
