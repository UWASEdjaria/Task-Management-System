"use client"
import { Calendar, UserCircle } from "lucide-react";
import { SidebarProps } from "@/types/task";

export default function TaskSidebar({ task, isEditing, onUpdate }: SidebarProps) {
  return (
    <aside className="lg:col-span-4 bg-slate-50/20 p-5 space-y-6">
      <section className="space-y-2">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Attribution</p>
        <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
          <div className="bg-slate-900 p-2 rounded-xl text-white"><UserCircle size={16} /></div>
          <div>
            <p className="text-[8px] font-bold text-slate-400 uppercase leading-none">Reporter</p>
            <p className="text-xs font-black text-slate-900">Djaria Uwase</p>
          </div>
        </div>
      </section>
      <section className="space-y-2">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Schedule</p>
        <div className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
          <Calendar size={16} className="text-slate-400" />
          <div>
            <p className="text-[8px] font-bold text-slate-400 uppercase leading-none">Due Date</p>
            {isEditing ? (
              <input 
                type="date" 
                aria-label="Date"
                className="text-xs font-bold outline-none bg-transparent" 
                value={task.dueDate} 
                onChange={(e) => onUpdate('dueDate', e.target.value)} 
              />
            ) : (
              <p className="text-xs font-black text-slate-900">{new Date(task.dueDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
}