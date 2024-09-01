import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HeroPage from "./components/HeroPage";
import PasswordReset from "./pages/PasswordReset";
import { Toaster } from "react-hot-toast";
import {
  RedirectAuthenticatedUser,
  ProtectedRoute,
} from "./components/Redirect";
import CreateVideo from "./pages/CreateVideo";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <main>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route
          path="/new/post"
          element={
            <ProtectedRoute>
              <CreateVideo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/auth/register"
          element={
            <RedirectAuthenticatedUser>
              <RegisterPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/auth/password-reset" element={<PasswordReset />} />
      </Routes>
    </main>
  );
}

export default App;
