"use client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/lib/constants";
import { Task } from "@/types/task";
import TaskHeader from "@/components/Tasks/TaskHeader";
import TaskSidebar from "@/components/Tasks/TaskSidebar";
import SubtaskManager from "@/components/Tasks/SubtaskManager";
import CommentSection from "@/components/Tasks/CommentSection";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_ENDPOINTS.TASKS}/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok) {
        setTask(result.data);
        setEditedTask(result.data);
      }
    };
    fetchTask();
  }, [id]);

  const handleUpdateField = <K extends keyof Task>(field: K, value: Task[K]) => {
    if (!editedTask) return;
    setEditedTask({ ...editedTask, [field]: value });
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_ENDPOINTS.TASKS}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) router.push('/dashboard/tasks');
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSave = async () => {
    if (!editedTask) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_ENDPOINTS.TASKS}/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(editedTask)
      });
      if (res.ok) {
        setTask(editedTask);
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!task) return <div className="p-10 text-center text-[10px] font-black uppercase text-slate-300">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TaskHeader 
        id={id as string} 
        isEditing={isEditing} 
        isSaving={isSaving} 
        onDelete={handleDelete} 
        onToggleEdit={() => {
          setIsEditing(!isEditing);
          if (isEditing) setEditedTask(task);
        }} 
        onSave={handleSave} 
      />

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        <main className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-6">
          <div className="max-w-3xl">
            <div className="flex gap-1.5 mb-4">
              <span className="bg-slate-900 text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase">{task.status}</span>
              <span className="bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded-md text-[8px] font-black uppercase">{task.priority}</span>
            </div>

            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Title</p>
              {isEditing ? (
                <input 
                  aria-label="Edit task title"
                  className="text-2xl font-black text-slate-900 outline-none w-full bg-slate-50 p-2 rounded-lg"
                  value={editedTask?.title} 
                  onChange={(e) => handleUpdateField('title', e.target.value)}
                />
              ) : (
                <h1 className="text-2xl font-black tracking-tight text-slate-900">{task.title}</h1>
              )}
            </div>

            <div className="mt-6 space-y-6">
              <section className="space-y-2">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Description</p>
                {isEditing ? (
                  <textarea 
                    aria-label="Edit task description"
                    className="w-full text-xs text-slate-600 leading-relaxed outline-none bg-slate-50 p-3 rounded-lg min-h-[100px]"
                    value={editedTask?.description} 
                    onChange={(e) => handleUpdateField('description', e.target.value)}
                  />
                ) : (
                  <p className="text-xs text-slate-600 leading-relaxed">{task.description || "No description."}</p>
                )}
              </section>

              <SubtaskManager taskId={id as string} initialSubtasks={task.subtasks || []} />
              <CommentSection taskId={id as string} />
            </div>
          </div>
        </main>

        <aside className="w-full lg:w-[350px] bg-slate-50/30 border-l border-slate-50 p-5 space-y-6">
          <TaskSidebar 
            task={isEditing ? editedTask! : task} 
            isEditing={isEditing} 
            onUpdate={handleUpdateField} 
          />
        </aside>
      </div>
    </div>
  );
}