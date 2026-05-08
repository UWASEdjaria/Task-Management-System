"use client"

import { useState, useEffect } from "react"
import { useRouter ,useSearchParams } from "next/navigation"
import { Search, Bell, Settings, ChevronDown, LogOut } from "lucide-react"
import { User } from "@/types/auth"

const TEAMS = ["Engineering", "Design", "Marketing", "Product"]

const getInitials = (name?: string) => {
  if (!name) return "UD"
  const parts = name.trim().split(" ")
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase()
}

export default function Header({ user }: { user: User | null }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState("Engineering")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (saved) setCurrentUser(JSON.parse(saved))
  }, [])
const handleSearch = (value: string) => {
    setSearchQuery(value)
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
  router.push(`?${params.toString()}`)}
  return (
    <header className="w-full  mb-2 sticky top-0 z-40 bg-[#f8fafc]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between gap-6">
        
        <div className="relative shrink-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Workspace
          </p>
          <button
            onClick={() => setIsWorkspaceOpen(v => !v)}
            className="flex items-center gap-2 text-2xl lg:text-3xl font-extrabold text-[#1e293b] hover:opacity-80 transition-opacity"
          >
            {selectedTeam}
            <ChevronDown size={18} className="text-gray-400 mt-1" />
          </button>

          {isWorkspaceOpen && (
            <div className="absolute mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden py-1">
              {TEAMS.map(team => (
                <button
                  key={team}
                  onClick={() => {
                    setSelectedTeam(team)
                    setIsWorkspaceOpen(false)
                  }}
                  className="block px-4 py-2.5 text-sm hover:bg-slate-50 w-full text-left font-medium text-slate-600 transition-colors"
                >
                  {team}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 lg:gap-6 flex-1 justify-end">
          
          <div className="relative max-w-[240px] w-full hidden sm:block">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex items-center gap-1 border-l border-slate-200 pl-3 lg:pl-6">
            <button 
            type="button"
            aria-label="Notifications"
            className="p-2 text-gray-400 hover:bg-white hover:text-blue-500 rounded-xl transition-all">
              <Bell size={20} />
            </button>
            <button
            type="button"
             aria-label="settings"
             className="p-2 text-gray-400 hover:bg-white hover:text-slate-600 rounded-xl transition-all">
              <Settings size={20} />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(v => !v)}
              className="w-10 h-10 bg-[#1e293b] text-white rounded-xl shadow-md hover:scale-105 transition-transform flex items-center justify-center font-bold text-sm"
            >
              {getInitials(currentUser?.fullName)}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {currentUser?.fullName || "User Account"}
                  </p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      localStorage.clear()
                      router.push("/auth/login")
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg text-sm font-bold transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  )
}