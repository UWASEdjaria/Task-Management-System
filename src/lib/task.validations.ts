import { z } from "zod"
import { TaskStatus, TaskPriority } from "@/types/task";


export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Task title must be at least 3 characters long")
    .max(100, "Title is too long"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  priority: z.nativeEnum(TaskPriority),
  status: z.nativeEnum(TaskStatus),
  dueDate: z.string().min(1, "Please select a due date"),
  duration: z.coerce.number().optional(),
});



export type CreateTaskInput = z.infer<typeof createTaskSchema>;