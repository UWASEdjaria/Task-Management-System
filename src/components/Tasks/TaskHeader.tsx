"use client"
import { Hash, Trash2, Edit2, X, Save } from "lucide-react";
import { TaskHeaderProps } from "@/types/task";

export default function TaskHeader({ id, isEditing, isSaving, onDelete, onToggleEdit, onSave }: TaskHeaderProps) {
  
  const handleDeleteClick = () => {
    // Native browser confirmation
    if (!confirm("Delete this task?")) return;
    
    // If user clicked 'OK', proceed with deletion
    onDelete();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-2.5 flex justify-between items-center">
      <div className="flex items-center gap-1.5">
        <Hash size={12} className="text-slate-300" />
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-tight">
          Task-{id.slice(-4).toUpperCase()}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button 
          type="button"
          onClick={onToggleEdit} 
          className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-900 flex items-center gap-1.5 transition-all"
        >
          {isEditing ? <><X size={13}/> Cancel</> : <><Edit2 size={13}/> Edit</>}
        </button>

        <div className="h-3 w-[1px] bg-slate-100" />

        <button 
          type="button"
          aria-label="Delete task"
          onClick={handleDeleteClick} 
          className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={15} />
        </button>

        {isEditing && (
          <button 
            type="button"
            onClick={onSave} 
            disabled={isSaving} 
            className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-1.5 hover:bg-slate-800 disabled:opacity-30 transition-all"
          >
            <Save size={13} /> {isSaving ? "Saving" : "Save"}
          </button>
        )}
      </div>
    </header>
  );
}