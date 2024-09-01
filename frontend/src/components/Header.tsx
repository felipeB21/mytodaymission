import Search from "./Search";
import Session from "./Session";

export default function Header() {
  return (
    <header className="shadow dark:border-b border-neutral-800 py-2 fixed top-0 w-full bg-background z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4">
        <div>
          <a href="/">
            <img className="w-auto h-8 rounded" src="/TM.png" alt="logo" />
          </a>
        </div>
        <Search />
        <Session />
      </div>
    </header>
  );
}
