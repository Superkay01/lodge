'use client'
import React from 'react'
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
} from "react-icons/fa";
import {usePathname} from "next/navigation";
import Image from 'next/image'
import Link from "next/link"
import { logout } from "@/app/utils/logout";
import {FaHouseMedical} from "react-icons/fa6"

const AdminSidebar = () => {
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
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname?.startsWith(href));
  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-[var(--color-royal-blue)] text-[var(--color-white)] flex-col z-40" aria-label="Admin navigation">
        <div className="px-4 h-16 flex items-center gap-2 font-semibold border-b border-[var(--color-hover-blue)]">
            <div className="h-9 w-9 grid place-items-center rounded-full font-bold text-[var(--color-royal-blue)]">
                <Image src="/logo.png" width="30" height="30" alt="Lodgelink logo"/>
            </div>
            <span>Admin</span>
        </div>

        <nav className="flex-1 ">
            <ul className="py-2">
                {nav.map(({href, icon: Icon, label}) =>(
                    <li key={href}>
                    <Link href={href} className={`flex items-center gap-2 px-4 py-3 transition-colors ${isActive(href)
                         ? 'bg-[var(--color-white)] text-[var(--color-medium-blue)] font-semibold shadow'
                        : "hover:bg-[var(--color-hover-blue)]/90"} `}
                        aria-current={isActive(href) ? 'page' : undefined}>
                            <Icon className="shrnk-0"/>
                            <span>{label}</span>
                        </Link>
                     </li>   
                ))}
            </ul>
        </nav>

        <button onClick={logout} className="flex items-center gap-2 px-4 py-3 text-left -[var(--color-hover-blue)] hover:text-[var(--color-white)] hover:bg-[var(--color-hover-blue)]/90">
        <FaSignOutAlt/>
        </button>
    </aside>
  )
}

export default AdminSidebar