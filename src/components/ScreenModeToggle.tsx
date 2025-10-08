"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const ScreenModeToggle = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (document.body.classList.contains("dark")) {
      setMode("dark");
    }
  }, []);

  const toggleMode = () => {
    if (mode === "light") {
      document.body.classList.add("dark");
      setMode("dark");
    } else {
      document.body.classList.remove("dark");
      setMode("light");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* ☀️ Light Mode Icon */}
      <div>
        <Image
          src="/sun-light.png"
          alt="Light mode icon"
          width={20}
          height={20}
          className="dark:hidden"
        />
        <Image
          src="/sun-dark.png"
          alt="Light mode icon (dark)"
          width={20}
          height={20}
          className="hidden dark:block"
        />
      </div>

      {/* 🔘 Toggle Button */}
      <button
        onClick={toggleMode}
        className={`w-12 h-7 bg-[#0025cc] rounded-full px-1 flex items-center transition-all duration-300 ${
          mode === "light" ? "justify-start" : "justify-end"
        }`}
      >
        <span className="h-5 w-5 rounded-full bg-white block shadow-md"></span>
      </button>

      {/* 🌙 Dark Mode Icon */}
      <div>
        <Image
          src="/moon-dark.png"
          alt="Dark mode icon"
          width={20}
          height={20}
          className="dark:hidden"
        />
        <Image
          src="/moon-light.png"
          alt="Dark mode icon (light)"
          width={20}
          height={20}
          className="hidden dark:block"
        />
      </div>
    </div>
  );
};

export default ScreenModeToggle;


