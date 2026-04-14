'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import StatCards from "@/components/statCard"
import { 
  Search, 
  Bell, 
  Settings, 
  ChevronDown, 
  Check, 
  LogOut 
} from "lucide-react"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const TEAMS = ["Engineering", "Design", "Marketing", "Product"]
const FIRST_DAY = 2
const TOTAL_DAYS = 30
const TODAY = 3

const getInitials = (name: string) => {
  if (!name) return "??"
  const parts = name.trim().split(" ")
  return parts.length >= 2 
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() 
    : parts[0][0].toUpperCase()
}

export default function DashboardPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState({ fullName: "", email: "" })
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState("Engineering")
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false) 

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Auth state synchronization failed:", error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 lg:ml-64 p-6 lg:p-10 pt-20 lg:pt-10">
        <header className="flex items-center justify-between mb-10">
          <div className="relative">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
              Workspace
            </p>
            <button
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              className="flex items-center gap-2 text-3xl font-bold text-[#1e293b] focus:outline-none"
            >
              {selectedTeam}
              <ChevronDown 
                size={20} 
                className={`text-gray-400 transition-transform duration-200 ${isWorkspaceOpen ? "rotate-180" : ""}`} 
              />
            </button>

            {isWorkspaceOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 overflow-hidden">
                {TEAMS.map((team) => (
                  <button
                    key={team}
                    onClick={() => {
                      setSelectedTeam(team)
                      setIsWorkspaceOpen(false)
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className={selectedTeam === team ? "font-bold text-[#1e293b]" : ""}>
                      {team}
                    </span>
                    {selectedTeam === team && <Check size={16} className="text-[#1e293b]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-gray-200 outline-none transition-all" 
              />
            </div>
            
            <Bell size={20} className="text-gray-400 cursor-pointer hover:text-[#1e293b] transition-colors" />
            <Settings size={20} className="text-gray-400 cursor-pointer hover:text-[#1e293b] transition-colors" />
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 bg-[#1e293b] rounded-full flex items-center justify-center text-white text-xs font-bold ring-4 ring-white shadow-sm hover:opacity-90 transition-all"
              >
                {getInitials(currentUser.fullName)}
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-4 bg-gray-50 rounded-xl mb-2">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {currentUser.fullName || "Guest User"}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {currentUser.email || "No email linked"}
                    </p>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-semibold group"
                  >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <StatCards />

        <section className="bg-white rounded-xl border border-gray-100 shadow-sm mt-10 p-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-bold text-[#1e293b]">April 2026</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">
                Schedule overview • {selectedTeam}
              </p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button className="px-5 py-2 text-xs font-bold bg-white shadow-sm rounded-lg">Month</button>
              <button className="px-5 py-2 text-xs font-bold text-gray-500 hover:text-gray-700">Week</button>
              <button className="px-5 py-2 text-xs font-bold text-gray-500 hover:text-gray-700">List</button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-6">
            {DAYS.map(day => (
              <p key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {day}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: FIRST_DAY }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: TOTAL_DAYS }).map((_, i) => {
              const dayNum = i + 1
              const isToday = dayNum === TODAY
              return (
                <div 
                  key={dayNum} 
                  className={`h-12 flex items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer
                  ${isToday 
                    ? "bg-[#1e293b] text-white shadow-lg scale-105" 
                    : "text-gray-600 hover:bg-gray-50"}`}
                >
                  {dayNum}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}