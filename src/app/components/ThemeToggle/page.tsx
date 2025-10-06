"use client";

import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering theme-dependent content
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <button
      className="relative rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
      onClick={() => setTheme(theme === "dark" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <FaSun className="h-6 w-6 text-yellow-500 transition-transform duration-300 ease-in-out dark:-rotate-90 dark:scale-0" />
      <FaMoon className="absolute h-6 w-6 text-blue-500 transition-transform duration-300 ease-in-out rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </button>
  );
}