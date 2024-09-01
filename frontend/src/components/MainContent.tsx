import { useLocation } from "react-router-dom";
import Header from "./Header";
import App from "../App";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

const MainContent = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/auth/login" ||
    location.pathname === "/auth/register" ||
    location.pathname === "/auth/password-reset";

  const { me, currentUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    me();
  }, [me]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Header />}
      <div className="flex-grow mt-20 max-w-6xl mx-auto px-4 w-full">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[30%] mb-4 md:mb-0">
            <Navbar
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
            />
          </div>
          <div className="w-full md:w-[70%]">
            <App />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
