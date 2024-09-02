import { Input } from "@nextui-org/input";
import { useState } from "react";
import { EyeSlashFilledIcon } from "../components/icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../components/icons/EyeFilledIcon";
import { Button, Link } from "@nextui-org/react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, isLoading } = useAuthStore();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signup(email, password, name, username);
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "An unexpected error occurred";
        toast.error(errorMessage);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="2xl:w-[20dvw] w-[30dvw] flex flex-col gap-5">
        <div className="flex gap-4">
          <a href="/">
            <img
              className="w-auto h-auto rounded"
              src="/TM_120.png"
              alt="logo"
            />
          </a>
          <h5 className="text-xl font-medium text-neutral-600">
            Sign up to see Today's Missions of your friends.
          </h5>
        </div>
        <form className="mt-5" onSubmit={handleRegister}>
          <div className="flex flex-col flex-wrap md:flex-nowrap gap-4">
            <Input
              type="email"
              label="Email"
              variant="bordered"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="text"
              label="Name"
              variant="bordered"
              placeholder="Enter your name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="text"
              label="Username"
              variant="bordered"
              placeholder="Enter your username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Password"
              variant="bordered"
              placeholder="Enter your password"
              name="password"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Register
            </Button>
          </div>
        </form>
        <div>
          <span className="pr-2">Do you have an account?</span>
          <Link href="/auth/login" underline="hover">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
