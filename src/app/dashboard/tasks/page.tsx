"use client"

import { useState, useEffect, useCallback } from "react"
import { apiFetch } from "@/lib/apiFetch"
import { useSearchParams } from "next/navigation"
import { MoreHorizontal } from "lucide-react"
import { Task, TaskStatus, TaskPriority, ApiTaskResponse, KANBAN_COLUMNS } from "@/types/task"
import StatCards from "@/components/statCard"
import NewTaskModal from "@/components/modals/NewTaskModal"
import TaskCard from "@/components/taskCard"
import Link from "next/link"

export default function TasksPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const [tasks, setTasks] = useState<Task[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)


  const fetchTasks = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) return

      const result = await apiFetch<ApiTaskResponse[]>("/tasks", {
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (result.success && result.data) {
        const normalized: Task[] = result.data.map(task => ({
          id: task.id || task._id || String(Math.random()),
          title: task.title,
          description: task.description,
          status: task.status?.toLowerCase() as TaskStatus,
          priority: task.priority?.toLowerCase() as TaskPriority,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
          duration: task.duration,
        }))
        setTasks(normalized)
      }
    } catch (error) {
      console.error("Fetch error:", error)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full h-full pb-4 px-4 md:px-6 lg:px-6 py-4">
      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTasks} 
      />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#1e293b]">Task Board</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-[#1e293b] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-700 transition-all hover:-translate-y-1 shadow-md"
        >
          <span className="text-base">+</span> New Task
        </button>
      </div>

      <StatCards tasks={tasks} />

      <div className="flex flex-col md:flex-row gap-2 mt-4 pb-4">
        {KANBAN_COLUMNS.map((column) => {
          const columnTasks = filteredTasks.filter(t => t.status?.toLowerCase() === column.value)
          
          return (
            <div key={column.value} className="flex-1">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${column.color}`}></span>
                  <h3 className="font-bold text-slate-700 text-sm tracking-wide uppercase">{column.label}</h3>
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <MoreHorizontal size={18} className="text-slate-400 cursor-pointer" />
              </div>

              <div className="space-y-2 min-h-[200px] bg-slate-50/50 p-2 rounded-[2.5rem] border border-dashed border-slate-200">
                {columnTasks.map((task) => (
                  <Link 
                    key={task.id} 
                    href={`/dashboard/tasks/${task.id}`} 
                    className="block transition-transform hover:scale-[1.02]"
                  >
                    <TaskCard task={task} />
                  </Link>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 opacity-30">
                    <p className="text-xs font-medium text-slate-400 italic">No tasks here</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}