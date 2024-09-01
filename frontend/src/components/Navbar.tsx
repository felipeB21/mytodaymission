import { User } from "../types/User";
import Home from "./icons/Home";
import Profile from "./icons/Profile";
import Trending from "./icons/Trending";

interface NavbarProps {
  currentUser?: User | null;
  isAuthenticated: boolean;
}

const NAV_LINKS = [
  { name: "Home", href: "/", icon: <Home /> },
  { name: "Popular", href: "/popular", icon: <Trending /> },
];

export default function Navbar({ currentUser, isAuthenticated }: NavbarProps) {
  const userLinks = isAuthenticated
    ? [
        {
          name: "Profile",
          href: `/profile/${currentUser?.username}`,
          icon: <Profile />,
        },
      ]
    : [{ name: "Profile", href: "/auth/login", icon: <Profile /> }];

  return (
    <nav>
      <ul className="flex flex-col gap-5">
        {NAV_LINKS.concat(userLinks).map((link) => (
          <li key={link.href}>
            <a
              className="text-2xl font-bold flex items-center gap-3 w-max hover:text-red-500"
              href={link.href}
            >
              {link.icon}
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
