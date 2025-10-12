"use client";
import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from "@/app/admin/AdminSidebar";
import Image from 'next/image';
import { FaCaretDown, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { logout } from "@/app/utils/logout";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle screen resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setIsSidebarCollapsed(mobile); 
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar onCollapseChange={setIsSidebarCollapsed} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        } bg-[var(--color-light-blue)] text-[var(--color-dark-gray)] min-w-0`}
      >
        <header
          className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-hover-blue)] bg-[var(--color-royal-blue)] text-[var(--color-white)] shadow-sm w-full"
        >
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 hover:bg-[var(--color-hover-blue)]/90 p-2 rounded-md transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="User profile menu"
            >
              <div className="h-8 w-8 rounded-full bg-white overflow-hidden">
                <Image
                  src="/user-avatar.png" // Replace with actual user avatar path
                  width={32}
                  height={32}
                  alt="User avatar"
                />
              </div>
              {!isMobile && <span className="text-sm font-medium">Admin User</span>}
              <FaCaretDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-[var(--color-dark-gray)] rounded-md shadow-lg z-50">
                <div className="p-3 border-b">
                  <p className="font-semibold">Admin User</p>
                  <p className="text-sm text-gray-500">admin@example.com</p>
                </div>
                <ul className="py-1">
                  <li>
                    <a
                      href="/admin/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#9faffa]"
                    >
                      <FaUser />
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="/admin/settings"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#9faffa]"
                    >
                      <FaCog />
                      Settings
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#9faffa] text-left"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-6 w-full">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;