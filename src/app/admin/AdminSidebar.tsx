'use client'

import React, { useState, useEffect } from 'react';
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaFileAlt,
  FaEnvelope,
  FaFlag,
  FaChartBar,
  FaCog,
  FaBook,
  FaSignOutAlt,
  FaChevronCircleRight,
  FaChevronCircleLeft,
} from "react-icons/fa";
import { usePathname } from "next/navigation";
import Image from 'next/image';
import Link from "next/link";
import { logout } from "@/app/utils/logout";
import { FaHouseMedical } from "react-icons/fa6";

interface AdminSidebarProps {
  onCollapseChange: (collapsed: boolean) => void;
}

const AdminSidebar = ({ onCollapseChange }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const nav = [
    { href: "/admin", icon: FaHome, label: "Overview" },
    { href: "/admin/users", icon: FaUsers, label: "Users" },
    { href: "/admin/listings", icon: FaBuilding, label: "Listings" },
    { href: "/admin/properties", icon: FaHouseMedical, label: "Properties" },
    { href: "/admin/receipts", icon: FaMoneyBillWave, label: "Receipts" },
    { href: "/admin/tenancies", icon: FaFileAlt, label: "Tenancies" },
    { href: "/admin/inquiries", icon: FaEnvelope, label: "Inquiries" },
    { href: "/admin/reports", icon: FaFlag, label: "Reports" },
    { href: "/admin/analytics", icon: FaChartBar, label: "Analytics" },
    { href: "/admin/settings", icon: FaCog, label: "Settings" },
    { href: "/admin/audit", icon: FaBook, label: "Audit Log" },
  ];

  const pathname = usePathname();

  // Detect active path
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname?.startsWith(href));

  // Handle screen resize for mobile view
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      const collapsed = mobile ? true : false;
      setIsCollapsed(collapsed);
      onCollapseChange(collapsed); // Notify parent of collapse state
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onCollapseChange]);

  // Handle collapse toggle
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      onCollapseChange(newState); // Notify parent of collapse state
      return newState;
    });
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[var(--color-royal-blue)] text-[var(--color-white)] flex flex-col z-40 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Admin navigation"
    >
      <div className="px-4 h-16 flex items-center gap-2 font-semibold border-b border-[var(--color-hover-blue)]">
        <div className="h-9 w-9 grid place-items-center rounded-full font-bold bg-white">
          <Image src="/logo.png" width={30} height={30} alt="Lodgelink logo" />
        </div>
        {!isCollapsed && <span>Admin</span>}
      </div>

      <nav className="flex-1">
        <ul className="py-2">
          {nav.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isActive(href)
                    ? 'bg-[var(--color-white)] text-[var(--color-medium-blue)] font-semibold shadow'
                    : 'hover:bg-[var(--color-hover-blue)]/90'
                }`}
                aria-current={isActive(href) ? 'page' : undefined}
              >
                <Icon className="shrink-0" />
                {!isCollapsed && <span>{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 text-left text-[var(--color-white)] hover:text-[var(--color-white)] hover:bg-[var(--color-hover-blue)]/90 transition-colors"
      >
        <FaSignOutAlt />
        {!isCollapsed && <span>Logout</span>}
      </button>

      {/* Toggle Button */}
      <button
        className={`absolute top-21 ${
          isCollapsed ? 'left-20' : 'left-64'
        } transform -translate-y-1/2 -translate-x-full text-white bg-[var(--color-medium-blue)] p-2 rounded-full`}
        onClick={toggleCollapse}
      >
        {isCollapsed ? <FaChevronCircleRight /> : <FaChevronCircleLeft />}
      </button>
    </aside>
  );
};

export default AdminSidebar;