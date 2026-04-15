
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt?: string;
  dueDate: string;
  duration?: number;
  subtasks?: Subtask[];
  
};
export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed"
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}
export interface ErrorResponse{
  error:string,
  message :string
}

export interface SelectOption {
  value: string;
  label: string;
}
export interface ApiTaskResponse {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt?: string;
  duration?: number;
}

export const KANBAN_COLUMNS = [
  { label: "To Do", value: TaskStatus.TODO, color: "bg-blue-500" },
  { label: "In Progress", value: TaskStatus.IN_PROGRESS, color: "bg-amber-500" },
  { label: "Done", value: TaskStatus.COMPLETED, color: "bg-emerald-500" }
] as const;

export interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export interface Subtask {
  id: string;
  text: string;
  done: boolean;
}
export interface TaskHeaderProps {
  id: string;
  isEditing: boolean;
  isSaving: boolean;
  onDelete: () => void;
  onToggleEdit: () => void;
  onSave: () => void;
}
export interface SidebarProps {
  task: Task;
  isEditing: boolean;
  onUpdate: (field: keyof Task, value: string) => void;
}
export interface SubtaskManagerProps {
  initialSubtasks: Subtask[];
  taskId: string;
}
export interface CommentUser {
  name: string;
  initials: string;
}

export interface Comment {
  id: string;
  user: CommentUser;
  text: string;
  time: string;
}