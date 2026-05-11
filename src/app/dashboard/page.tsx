"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { apiFetch } from "../../lib/apiFetch"
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Clock, Filter, ListFilter, AlertCircle, CalendarClock, Flame, TrendingUp
} from "lucide-react"
import { Task, TaskStatus, TaskPriority, ApiTaskResponse } from "../../types/task"
import { PRIORITY_STYLES } from "@/lib/constants"

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

export default function DashboardPage() {

  const [tasks, setTasks] = useState<Task[]>([])
  const [viewDate, setViewDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toDateString())
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesDate = new Date(task.dueDate).toDateString() === selectedDate
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority
      const matchesStatus = filterStatus === "all" || task.status === filterStatus
      return matchesDate && matchesPriority && matchesStatus
    })
  }, [tasks, selectedDate, filterPriority, filterStatus])

  const stats = useMemo(() => { //Calculates dashboard statistics.

    const today = new Date() 
    today.setHours(0, 0, 0, 0)

    const overdue = tasks.filter(t => {

      const due = new Date(t.dueDate)
      due.setHours(0, 0, 0, 0)

      return due < today && t.status !== TaskStatus.COMPLETED
    }).length

    const dueToday = tasks.filter(t =>
      new Date(t.dueDate).toDateString() === new Date().toDateString()
    ).length

    const highPriority = tasks.filter(t =>
      t.priority === TaskPriority.HIGH && t.status !== TaskStatus.COMPLETED
    ).length

    const completionRate = tasks.length > 0
      ? Math.round((tasks.filter(t => t.status === TaskStatus.COMPLETED).length / tasks.length) * 100)
      : 0
    return { overdue, dueToday, highPriority, completionRate }
  }, [tasks])

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const monthName = viewDate.toLocaleString('default', { month: 'long' })//Convert number month into text

    return { firstDayOfMonth, daysInMonth, monthName, year }
  }, [viewDate])

  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      const result = await apiFetch<ApiTaskResponse[]>("/tasks", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (result.success && result.data) {
        const normalizedTasks: Task[] = result.data.map((task: ApiTaskResponse) => ({
          id: task.id || task._id || String(Math.random()),
          title: task.title,
          description: task.description,
          status: task.status as TaskStatus,
          priority: task.priority as TaskPriority,
          dueDate: task.dueDate,
          createdAt: task.createdAt
        }))
        setTasks(normalizedTasks)
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const changeMonth = (offset: number) => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1))
  const changeYear = (offset: number) => setViewDate(new Date(viewDate.getFullYear() + offset, viewDate.getMonth(), 1))

  return (
    <div className="w-full p-4 flex flex-col gap-4">

      {/* Stat Cards — 4 in a row, compact height */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 flex items-center gap-3 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="p-2 bg-red-50 rounded-lg shrink-0">
            <AlertCircle size={15} className="text-red-500" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Overdue</p>
            <p className="text-xl font-bold text-slate-800 leading-tight">{stats.overdue}</p>
            <p className="text-[9px] text-gray-400">Past due</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 flex items-center gap-3 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="p-2 bg-amber-50 rounded-lg shrink-0">
            <CalendarClock size={15} className="text-amber-500" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Due Today</p>
            <p className="text-xl font-bold text-slate-800 leading-tight">{stats.dueToday}</p>
            <p className="text-[9px] text-gray-400">Today</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 flex items-center gap-3 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="p-2 bg-orange-50 rounded-lg shrink-0">
            <Flame size={15} className="text-orange-500" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">High Priority</p>
            <p className="text-xl font-bold text-slate-800 leading-tight">{stats.highPriority}</p>
            <p className="text-[9px] text-gray-400">Urgent</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 flex items-center gap-3 hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
            <TrendingUp size={15} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Completion</p>
            <p className="text-xl font-bold text-slate-800 leading-tight">{stats.completionRate}%</p>
            <p className="text-[9px] text-gray-400">Overall</p>
          </div>
        </div>

      </div>

      {/* Calendar + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Calendar */}
        <section className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Calendar header row */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">
              {calendarData.monthName} {calendarData.year}
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button aria-label="Previous Year" onClick={() => changeYear(-1)} className="p-1.5 hover:bg-gray-50"><ChevronsLeft size={14} className="text-slate-500" /></button>
                <button aria-label="Next Year" onClick={() => changeYear(1)} className="p-1.5 hover:bg-gray-50"><ChevronsRight size={14} className="text-slate-500" /></button>
              </div>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button aria-label="Previous Month" onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-gray-50 border-r border-gray-200"><ChevronLeft size={14} className="text-slate-700" /></button>
                <button onClick={() => { setViewDate(new Date()); setSelectedDate(new Date().toDateString()) }} className="px-3 py-1.5 text-[11px] font-medium hover:bg-gray-50">Today</button>
                <button aria-label="Next Month" onClick={() => changeMonth(1)} className="p-1.5 hover:bg-gray-50 border-l border-gray-200"><ChevronRight size={14} className="text-slate-700" /></button>
              </div>
            </div>
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
              <Filter size={11} className="text-gray-400 mr-1.5" />
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} aria-label="Filter by priority" className="bg-transparent text-[11px] font-bold text-gray-600 outline-none cursor-pointer">
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
              <ListFilter size={11} className="text-gray-400 mr-1.5" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} aria-label="Filter by status" className="bg-transparent text-[11px] font-bold text-gray-600 outline-none cursor-pointer">
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
            {DAYS.map(day => (
              <p key={day} className="py-2 text-center text-[10px] font-bold text-gray-400">{day}</p>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {Array.from({ length: calendarData.firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-12 border-r border-b border-gray-100 bg-gray-50/30" />
            ))}
            {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
              const dayNum = i + 1
              const currentIterationDate = new Date(calendarData.year, viewDate.getMonth(), dayNum)
              const dateString = currentIterationDate.toDateString()
              const isToday = dateString === new Date().toDateString()
              const isSelected = selectedDate === dateString
              const hasTask = tasks.some((t: Task) => new Date(t.dueDate).toDateString() === dateString)

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDate(dateString)}
                  className={`h-12 px-1 border-r border-b border-gray-100 flex flex-col items-end justify-between py-1 transition-all
                    ${isSelected ? "bg-gray-50" : "bg-white hover:bg-gray-50/50"}
                    ${isToday && !isSelected ? "ring-2 ring-inset ring-[#1e293b]" : ""}`}
                >
                  <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full
                    ${isToday ? "bg-slate-900 text-white" : "text-gray-500"}
                    ${isSelected && !isToday ? "ring-1 ring-gray-300" : ""}`}
                  >
                    {dayNum}
                  </span>
                  {hasTask && <div className="w-full h-1 bg-slate-200 rounded-full opacity-70" />}
                </button>
              )
            })}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="w-full lg:w-72">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">

            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                {selectedDate === new Date().toDateString() ? "Today's Tasks" : "Schedule"}
              </h4>
              <span className="text-[11px] font-bold text-slate-400">
                {selectedDate?.split(' ').slice(1, 3).join(' ')}
              </span>
            </div>

            <div className="space-y-2">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`px-3 py-2 rounded-lg border border-gray-100 bg-white border-l-4 hover:-translate-y-1 hover:shadow-md transition-all duration-200 ${
                      task.priority === "high" ? "border-l-blue-400" :
                      task.priority === "medium" ? "border-l-green-400" : "border-l-orange-400"
                    }`}
                  >
                    <h5 className="text-xs font-semibold text-gray-800 leading-tight">{task.title}</h5>
                    <div className="mt-1 flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[task.priority]}`}>
                        {task.priority}
                      </span>
                      <span className="text-[9px] font-bold text-slate-300 uppercase">
                        {task.status.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                  <Clock size={16} className="mb-1" />
                  <p className="text-[11px] font-medium">No tasks scheduled.</p>
                </div>
              )}
            </div>

          </div>
        </aside>

      </div>
    </div>
  )
}
