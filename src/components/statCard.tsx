import { Task ,TaskPriority, TaskStatus } from '@/types/task';
import React from 'react'

interface StatCardsProps {
  tasks?: Task[];
}

export default function StatCards({ tasks =[] }: StatCardsProps) {
  // Logic: Separate counts for each specific status
  const totalTasks = tasks.length;
  
  const todoTasks = tasks.filter(
    (task) => task.status === TaskStatus.TODO
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === TaskStatus.IN_PROGRESS
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === TaskStatus.COMPLETED
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === TaskPriority.HIGH
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

      <div className="bg-white p-4 rounded-xl border border-gray-100 border-l-4 border-l-slate-800 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Tasks</p>
        <h2 className="text-2xl font-bold text-[#1e293b]">{totalTasks}</h2>
        <p className="text-[10px] text-gray-400 font-medium uppercase">All Tasks</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 border-l-4 border-l-blue-400 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">To Do</p>
        <h2 className="text-2xl font-bold text-[#1e293b]">{todoTasks}</h2>
        <p className="text-[10px] text-gray-400 font-medium uppercase">Pending</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 border-l-4 border-l-amber-400 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">In Progress</p>
        <h2 className="text-2xl font-bold text-[#1e293b]">{inProgressTasks}</h2>
        <p className="text-[10px] text-gray-400 font-medium uppercase">Active</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 border-l-4 border-l-emerald-400 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Completed</p>
        <h2 className="text-2xl font-bold text-[#1e293b]">{completedTasks}</h2>
        <p className="text-[10px] text-gray-400 font-medium uppercase">Finished</p>
      </div>

    </div>
  );
}