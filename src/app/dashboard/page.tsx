'use client'
import { useState } from "react"
import Sidebar from "@/components/sidebar"
import StatCards from "@/components/statCard"
import { Search, Bell, Settings, ChevronDown, Check } from "lucide-react"

const DAYS     = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const TEAMS    = ["Engineering", "Design", "Marketing", "Product"]
const MEETINGS = [
  { title: "Engineering Sync", time: "14:00 – 15:30" },
  { title: "Design Review",    time: "16:00 – 16:45" },
]
const STATS = [
  { label: "Completed", value: "42"  },
  { label: "On-time",   value: "91%" },
]

const FIRST_DAY = 2, TOTAL_DAYS = 30, TODAY = 3

const card = "bg-white rounded-xl border border-gray-300 shadow-sm"
const btn  = "bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"

export default function DashboardPage() {
  // Controls whether the dropdown list is visible
  const [isOpen, setIsOpen] = useState(false)
  // Tracks which team is currently selected
  const [selectedTeam, setSelectedTeam] = useState("Engineering")

  const handleSelect = (team: string) => {
    setSelectedTeam(team)
    setIsOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 lg:ml-64 p-6 lg:p-8 pt-16 lg:pt-8">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">

          {/* Team dropdown */}
          <div className="relative">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Workspace</p>

            {/* Trigger button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 text-2xl font-semibold text-gray-900 hover:text-gray-700 transition-colors"
            >
              {selectedTeam}
              <ChevronDown size={18} className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown list — shown only when isOpen is true */}
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-300 rounded-xl shadow-sm z-10 overflow-hidden">
                {TEAMS.map(team => (
                  <button
                    key={team}
                    onClick={() => handleSelect(team)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {team}
                    {/* Show "Current" checkmark on the selected team */}
                    {team === selectedTeam && <Check size={14} className="text-gray-800" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-200 text-gray-500 rounded-lg py-2 pl-9 pr-4 text-xs w-52 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>
            <Bell     size={18} className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
            <Settings size={18} className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
            <div className="w-8 h-8 bg-gray-800 rounded-full cursor-pointer" />
          </div>
        </header>

        {/* Stat cards */}
        <StatCards />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Calendar */}
          <div className={`${card} lg:col-span-3 p-6 lg:p-8`}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">April 2026</h3>
                <p className="text-xs text-gray-500 mt-0.5">Schedule overview · {selectedTeam}</p>
              </div>
              <div className="flex bg-gray-100 border border-gray-300 rounded-lg p-1 text-[10px] font-semibold">
                <button className={`${btn} px-4 py-1.5`}>Month</button>
                <button className="px-4 py-1.5 text-gray-500 hover:text-gray-900">Week</button>
                <button className="px-4 py-1.5 text-gray-500 hover:text-gray-900">List</button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {DAYS.map(d => (
                <p key={d} className="text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider py-2">{d}</p>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: FIRST_DAY }).map((_, i) => <div key={i} />)}
              {Array.from({ length: TOTAL_DAYS }).map((_, i) => {
                const day = i + 1
                return (
                  <button key={day} className={`h-10 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all
                    ${day === TODAY ? "bg-gray-800 text-white" : "text-gray-700 hover:bg-gray-200"}`}>
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">

            {/* Meetings */}
            <div className={`${card} p-6`}>
              <div className="flex justify-between items-center mb-5">
                <h4 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Meetings</h4>
                <span className="text-gray-300 text-lg cursor-pointer">···</span>
              </div>
              <div className="space-y-2 mb-5">
                {MEETINGS.map(m => (
                  <div key={m.title} className="flex items-center gap-3 bg-gray-100 rounded-lg p-3">
                    <div className="w-0.5 h-7 bg-gray-800 rounded-full" />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{m.title}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className={`${btn} w-full py-2.5 text-xs mb-2`}>+ Create</button>
              <button className="w-full bg-gray-200 text-gray-500 rounded-lg py-2.5 text-xs font-semibold hover:bg-gray-300 transition-colors">View All</button>
            </div>

            {/* Stats Archive */}
            <div className={`${card} p-6`}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-4">Stats Archive</p>
              <h2 className="text-6xl font-light text-gray-900 leading-none mb-1">84<span className="text-2xl">%</span></h2>
              <p className="text-[10px] text-gray-500 font-medium mb-5">Efficiency Rate</p>
              {STATS.map(s => (
                <div key={s.label} className="flex justify-between items-center border-t border-gray-200 pt-3">
                  <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{s.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{s.value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
