"use client"
import { useState } from "react";
import { Plus, CheckCircle2, Circle, Trash2, Loader2 } from "lucide-react";
import { Subtask, SubtaskManagerProps } from "@/types/task";
import { API_ENDPOINTS } from "@/lib/constants";

export default function SubtaskManager({ initialSubtasks, taskId }: SubtaskManagerProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialSubtasks);
  const [input, setInput] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const getAuthHeader = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  });
 const onAdd = async () => {
    if (!input.trim()) return;
    setIsAdding(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.SUBTASK}`, {
        method: "POST",
        headers:getAuthHeader(),
        body: JSON.stringify({ text: input.trim(), taskId, done: false }),
      });
      const result = await res.json();
      if (res.ok) {
        setSubtasks([...subtasks, result.data ]);
        setInput("");
      }
    } catch (err) {
      console.error("Save failed because:", err);
    } finally {
      setIsAdding(false);
    }
  };

 const toggle = async (id: string, currentDone: boolean) => {
    try {
      // Update UI immediately (Optimistic Update)
      setSubtasks(subtasks.map(s => s.id === id ? { ...s, done: !s.done } : s));

      await fetch(`${API_ENDPOINTS.SUBTASK}/${id}`, {
        method: "PATCH",
        headers: getAuthHeader(),
        body: JSON.stringify({ done: !currentDone }),
      });
    } catch (err) {
      console.error("Toggle failed");
      // Revert UI if the database update fails
      setSubtasks(subtasks.map(s => s.id === id ? { ...s, done: currentDone } : s));
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.SUBTASK}/${id}`, {
         method: "DELETE",
        headers: getAuthHeader() });
      if (res.ok) {
        setSubtasks(subtasks.filter(s => s.id !== id));
      }else{
        console.error("Delete failed with status:", res.status);
      }
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const doneCount = subtasks.filter(s => s.done).length;

  return (
    <section className="pt-6 border-t border-slate-100 space-y-3">
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-300">
        <span>Checklist</span>
        <span className="text-slate-400">{doneCount}/{subtasks.length}</span>
      </div>

      <div className="space-y-1">
        {subtasks.map((sub) => (
          <div key={sub.id} className="group flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
            <button onClick={() => toggle(sub.id, sub.done)} type="button">
              {sub.done ? <CheckCircle2 size={15} className="text-emerald-500" /> : <Circle size={15} className="text-slate-200" />}
            </button>
            <span className={`text-[11px] font-bold flex-1 ${sub.done ? "line-through text-slate-300" : "text-slate-600"}`}>
              {sub.title}
            </span>
            <button
             type="button"
             aria-label="Delete"
             onClick={() => remove(sub.id)} className="opacity-0 group-hover:opacity-100 p-1">
              <Trash2 size={12} className="text-slate-300 hover:text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <div className="relative mt-2">
        <input 
          aria-label="New subtask" placeholder="Add a step..." value={input} 
          onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onAdd()}
          className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-[11px] outline-none focus:ring-1 ring-slate-100"
        />
        <button onClick={onAdd} disabled={isAdding || !input.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {isAdding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={14} />}
        </button>
      </div>
    </section>
  );
}