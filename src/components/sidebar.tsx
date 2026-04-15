'use client'

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation" 
import { 
  Home, 
  Users, 
  LayoutGrid, 
  Folder, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Plus, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react"
import { APP_NAME } from "@/lib/constants";

interface SidebarProps {
  onLogout: () => void;
  onNewTask?: () => void;
}

const NAV_ITEMS = [
  { icon: Home,        label: "Home",         path: "/dashboard" },
  { icon: Users,       label: "Members",      path: "/dashboard/members" },
  { icon: LayoutGrid,  label: "Departments",  path: "/dashboard/departments" },
  { icon: Folder,      label: "Projects",     path: "/dashboard/projects" },
  { icon: Calendar,    label: "Meetings",     path: "/dashboard/meetings" },
  { icon: CheckSquare, label: "Tasks",        path: "/dashboard/tasks" },
  { icon: Clock,       label: "Sprints",      path: "/dashboard/sprints" },
]

export default function Sidebar({ onLogout, onNewTask }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isTasksPage = pathname === "/dashboard/tasks"

  const handleNavigate = (path: string) => {
    router.push(path)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Navigation Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-gray-200 p-2 rounded-lg shadow-sm"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar Navigation Panel */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-300 flex flex-col px-5 py-8 z-40 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        
        <div className="mb-10 mt-6 lg:mt-0">
          <h1 className="font-black text-lg text-gray-900 tracking-tight">{APP_NAME}</h1>
          <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5 tracking-widest">TaskBoard</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col flex-1 gap-1">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
            <button
              key={label}
              onClick={() => handleNavigate(path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === path 
                  ? "bg-gray-800 text-white" 
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

               {/* Action Controls */}
           <div className="pt-6 border-t border-gray-100 space-y-1">
                {isTasksPage && onNewTask && (
          <button 
              onClick={onNewTask} 
              className="w-full bg-gray-800 text-white rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-bold mb-4 hover:bg-gray-700 transition-colors"
              >
              <Plus size={14} /> New Task
          </button>
          )}
          
          <button 
            onClick={onLogout} 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}