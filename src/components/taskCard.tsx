"use client"

import { PRIORITY_STYLES, PRIORITY_TEXT_HOVER } from "@/lib/constants"
import { Task, TaskPriority } from "@/types/task"
import { ArrowRight, Calendar, Clock } from "lucide-react"

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="bg-slate-50 px-3 py-2.5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-100 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gray-200 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />
      <div className="relative z-10"></div>
      <div className="flex justify-between items-center mb-1.5">
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${PRIORITY_STYLES[task.priority as TaskPriority] || "bg-slate-50 text-slate-500"}`}>
          {task.priority}
        </span>
       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 text-gray-600 translate-x-2 group-hover:translate-x-0">
             <span className="text-[10px] font-bold uppercase tracking-tighter">View Details</span>
             <ArrowRight size={12} />
          </div>
        
      </div>

      <h3 className={`font-extrabold text-slate-800 text-[15px] leading-tight mb-1.5 transition-colors ${PRIORITY_TEXT_HOVER[task.priority as TaskPriority]}`}>
        {task.title}
      </h3>

      <p className="text-slate-400 text-[11px] font-medium line-clamp-1 mb-2">
        {task.description || "No description"}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1 text-slate-400">
          <Calendar size={11} />
          <span className="text-[10px] font-medium">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "No date"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={11} />
          <span className="text-[10px]">{task.duration ? `${task.duration}m` : "N/A"}</span>
        </div>
      </div>
     
    </div>
  )
}
