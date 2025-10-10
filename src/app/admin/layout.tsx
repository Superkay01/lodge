"use client";
import React from 'react'
import AdminSidebar from "@/app/admin/AdminSidebar"

const AdminLayout = ({children} : {children: React.ReactNode}) => {
  return (
    <div className="flex min-h-screen">
        <AdminSidebar/>
        <div className="flex-1 ml-64 bg-[var(--color-light-blue)] text-[var(--color-dark-gray)] ">
           <header className="h-16 flex items-center px-6 border-b border-[var(--color-hover-blue)] bg-[var(--color-white)] shadow-sm">
                <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            </header>
            <main className="p-6">{children}</main>
        </div>
    </div>
  )
}

export default AdminLayout