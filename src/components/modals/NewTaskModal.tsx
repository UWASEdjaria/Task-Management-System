'use client'

import { useState ,useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createTaskSchema, type CreateTaskInput } from "../../lib/task.validations"
import { X, ChevronDown, Loader2, Check } from "lucide-react"
import { SubmitHandler } from "react-hook-form";
import { TaskStatus, TaskPriority } from "@/types/task";
import { API_ENDPOINTS } from "../../lib/constants";



interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewTaskModal({ isOpen, onClose, onSuccess }: NewTaskModalProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
   defaultValues: {priority: TaskPriority.MEDIUM, status: TaskStatus.TODO
}
  });
  useEffect(() => {
    register("priority");
    register("status");
  }, [register]);

  if (!isOpen) return null;

  const onSubmit:SubmitHandler<CreateTaskInput> = async (data: CreateTaskInput) => {
    console.log("Form Data being sent to Backend:", data);
    try {
      const token = localStorage.getItem("token");
     
      const response = await fetch(API_ENDPOINTS.TASKS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Submission failed");
    }
  };

  const CustomSelect = ({
    label,
    name,
    options
  }: {
    label: string,
    name: keyof CreateTaskInput,
    options: { value: string, label: string }[]
  }) => {
    const currentValue = watch(name);
    const isDropdownOpen = activeDropdown === name;
    const [duration, setDuration] = useState("")
    return (
      <div className="relative space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
          {label}
        </label>

        <button
          type="button"
          onClick={() => setActiveDropdown(isDropdownOpen ? null : name)}
          className={`w-full flex items-center justify-between bg-slate-50 border rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-sm transition-all
            ${isDropdownOpen
              ? 'border-slate-300 ring-2 ring-slate-100 text-slate-900'
              : 'border-slate-100 text-slate-600'
            }`}
        >
          <span className="capitalize">
            {currentValue?.replace('-', ' ')}
          </span>
          <ChevronDown
            size={18}
            className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-[150] left-0 right-0 top-[calc(100%+4px)] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
             
                  setValue(name, opt.value as CreateTaskInput[keyof CreateTaskInput],{
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                  });
                  
                  setActiveDropdown(null);
                }}
                className="w-full flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-b border-slate-50 last:border-none"
              >
                {opt.label}
                {currentValue === opt.value && (
                  <Check size={16} className="text-slate-900" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => setActiveDropdown(null)}
    >
      <div
        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col h-fit max-h-[96vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-3 sm:px-8 py-4 border-b border-gray-50 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">New Task</h2>
          <button 
           type="button" 
           onClick={onClose} aria-label="Close modal" className="p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
         <div className="px-5 py-3">
          <form onSubmit={handleSubmit(onSubmit )} className="space-y-4">

            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Task Title
              </label>
              <input
                {...register("title")}
                placeholder="What needs to be done?"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-200"
              />
              {errors.title && (
                <p className="text-red-500 text-[10px]">{errors.title.message}</p>
              )}
            </div>

            {/* Priority */}
            <div className="grid grid-cols-2  gap-3">
            <CustomSelect
              label="Priority"
              name="priority"
              options={[
                { value: TaskPriority.LOW, label: 'Low' },
                { value: TaskPriority.MEDIUM, label: 'Medium' },
                { value: TaskPriority.HIGH, label: 'High' }
              ]}
            />
             {/* Status */}
            <CustomSelect
              label="Initial Status"
              name="status"
              options={[
                { value: TaskStatus.TODO, label: 'To Do' },
                { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
                { value: TaskStatus.COMPLETED, label: 'Completed' }
              ]}
            />
          </div>
              {/* Due Date & Duration */}
              <div className="grid grid-cols-2 gap-3">  
             <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Due Date</label>
              <input 
              type="date" 
              {...register("dueDate")} 
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none"
               />
            </div>
            <div className="space-y-1">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Estimated Duration (Minutes)
             </label>
           <input
            type="number"
            {...register("duration")}
            placeholder="e.g. 45"
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-3 py-3 sm:px-5 sm:py-4 text-sm outline-none focus:ring-2 focus:ring-slate-200"
            />
            {errors.duration && (
           <p className="text-red-500 text-[10px]">{errors.duration.message}</p>
           )}
           </div>
           </div>
            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="Details (optional)..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-3 py-3 sm:px-5 sm:py-4 text-sm outline-none resize-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1e293b] text-white font-bold py-4 sm:py-5 rounded-2xl hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isSubmitting
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : "Add Task"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}