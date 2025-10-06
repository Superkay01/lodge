"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/app/ui/Container";


const Navbar = () => {
  const links = [
    { href: "/", label: "Home" },
    { href: "/listings", label: "Listings" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const closeMenu = () => setIsOpen(false);

  //   Lock Body Scroll when mobile menu is open (nice small screens)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[#0025cc] backdrop-blur border-b">
      <Container className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
          <Image
            src="/logo.png"
            alt="Lodgelink"
            width={28}
            height={28}
            priority
          />
          <span className="hidden md:flex items-center gap-6 text-white">
            Lodgelink
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-opacity ${
                isActive(l.href)
                  ? "font-semibold text-white"
                  : "opacity-80 hover:opacity-100 text-gray-200"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm px-3 py-2 rounded-lg hover-bg-[#9faffa]"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="text-sm px-3 py-2 rounded-lg bg-[#00db00] text-white  hover-opacity-90"
            >
              Sign Up
            </Link>
          </div>
         
        </div>

        {/* Hamburger Show on md<) */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-[#9faffa] text-white"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          {/* Icon: 3bars / X */}
          <svg
            className={`h5 w-5 text-white ${isOpen ? "hidden" : "block"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <svg
            className={`h5 w-5 text-white  ${isOpen ? "block" : "hidden"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </Container>
      {/* Mobile Panel */}
      <div
        className={`md:hidden border-b bg-[#0025cc] transition-[max-height,opacity] duration-200 ease-out overflow-hidden ${
          isOpen ? "max-h-96 opcity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-4 py-3 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={closeMenu}
              className={`block rounded-lg px-3 py-2 text-sm ${
                isActive(l.href)
                  ? "font-semibold bg-white text-[#0025cc]"
                  : "text-white opacity-80 hover:opacity-100 hover:bg-[#2e4cd5] "
              }`}
            >
              {l.label}
            </Link>
          ))}

          {/* Auth Action in Mobile */}
          <div className="mt-2 flex gap-2">
            <Link
              href="/login"
              onClick={closeMenu}
              className="flex-1 text-center text-sm px-3 py-2 rounded-lg bg-[#542242] hover:bg-[#2e4cd5] text-white"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={closeMenu}
              className="flex-1 text-center text-sm px-3 py-2 rounded-lg bg-[#00db00] hover:opacity-90 text-white"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
