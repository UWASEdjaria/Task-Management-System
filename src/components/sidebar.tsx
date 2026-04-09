'use client'
import { useState } from "react"
import { Home, Users, LayoutGrid, Folder, Calendar, CheckSquare, Clock, Plus, HelpCircle, LogOut, Menu, X } from "lucide-react"

const NAV = [
  { icon: Home,        label: "Home"        },
  { icon: Users,       label: "Members"     },
  { icon: LayoutGrid,  label: "Departments" },
  { icon: Folder,      label: "Projects"    },
  { icon: Calendar,    label: "Meetings"    },
  { icon: CheckSquare, label: "Tasks",  active: true },
  { icon: Clock,       label: "Sprints"     },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-gray-300 rounded-lg p-2 shadow-sm"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Backdrop */}
      {open && <div className="lg:hidden fixed inset-0 bg-black/10 z-30" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-300 flex flex-col px-5 py-8 z-40 transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

        <div className="mb-10 mt-6 lg:mt-0">
          <h1 className="font-black text-lg tracking-tighter text-gray-900">THE ARCHIVE</h1>
          <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-[0.2em] mt-0.5">TaskBoard</p>
        </div>

        <nav className="flex flex-col flex-1 gap-0.5">
          {NAV.map(({ icon: Icon, label, active }) => (
            <div key={label} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm font-medium ${
              active ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200"
            }`}>
              <Icon size={16} />
              <span>{label}</span>
            </div>
          ))}
        </nav>

        <div className="pt-6 border-t border-gray-200 space-y-1">
          <button className="w-full bg-gray-800 text-white rounded-lg py-3 flex items-center justify-center gap-2 text-sm font-semibold hover:bg-gray-700 transition-colors mb-3">
            <Plus size={14} /> New Task
          </button>
          {[{ icon: HelpCircle, label: "Help" }, { icon: LogOut, label: "Logout" }].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-all">
              <Icon size={16} /><span>{label}</span>
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}
