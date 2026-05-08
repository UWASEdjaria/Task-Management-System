"use client"

import Sidebar from "@/components/sidebar"
import Header from "../dashboard/header"
import { useEffect, useState } from "react"
import { User } from "@/types/auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")

    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch {}
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar
        onLogout={() => {
          localStorage.clear()
          window.location.href = "/auth/login"
        }}
      />

      <main className="flex-1 lg:ml-64 overflow-x-hidden">
        <Header user={currentUser} />

        <div className="p-4 pt-2">
          {children}
        </div>
      </main>
    </div>
  )
}