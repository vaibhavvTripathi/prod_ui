"use client";
import React from "react";
import { Sun, Moon, LogOut, User as UserIcon } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useAuthStore } from "@/store/authStore";

const UserMenu: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(true);
  const avatarRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setIsDark(
      typeof window !== "undefined" &&
        document.documentElement.classList.contains("dark")
    );
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      setIsDark(true);
    }
  };


  return (
    <div className="relative">
      <button
        ref={avatarRef}
        onClick={() => {
          setMenuOpen((v) => !v);
          console.log("Avatar clicked");
        }}
        className="flex items-center gap-2 p-1 pr-3 rounded-full bg-muted border border-border hover:bg-primary/10 transition focus:outline-none focus:ring-2 focus:ring-primary/40"
        aria-label="User menu"
      >
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.first}
            className="w-8 h-8 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-gray-600">
            <UserIcon className="w-5 h-5" />
          </span>
        )}
        <span className="font-medium text-foreground text-base max-w-[100px] truncate">
          {user ? user.first : "User"}
        </span>
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-lg py-2 z-50 animate-fade-in flex flex-col">
          <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border flex items-center gap-2">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.first}
                className="w-6 h-6 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <UserIcon className="w-5 h-5 text-gray-400" />
            )}
            <span className="truncate">
              {user ? user.first + " " + (user.lastname || "") : "User"}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition text-foreground"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
