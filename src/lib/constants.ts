import { TaskPriority } from "@/types/task";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const APP_NAME = "TaskGrid";

export const COLORS = {
  PRIMARY: "#1e293b",// The dark slate you use for buttons
  DANGER: "#ef4444", // Red for errors
};

export const API_ENDPOINTS = {
  TASKS: `${API_BASE_URL}/tasks`,
  COMMENTS: `${API_BASE_URL}/comments`,
  SUBTASK: `${API_BASE_URL}/subtasks`,
  AUTH: `${API_BASE_URL}/auth`,
};
export const PRIORITY_STYLES = {
  [TaskPriority.HIGH]: "text-blue-500 bg-blue-50 border-blue-100",
  [TaskPriority.MEDIUM]: "text-green-500 bg-green-50 border-green-100",
  [TaskPriority.LOW]: "text-orange-500 bg-orange-50 border-orange-100",
}

export const PRIORITY_TEXT_HOVER = {
  [TaskPriority.HIGH]: "group-hover:text-blue-700",
  [TaskPriority.MEDIUM]: "group-hover:text-green-700",
  [TaskPriority.LOW]: "group-hover:text-orange-700",
}