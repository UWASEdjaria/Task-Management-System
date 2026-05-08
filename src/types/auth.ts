export interface User {
  fullName: string;
  email: string;
  avatar?: string;
}

export interface ApiError {
  error: string;
  message: string;
}