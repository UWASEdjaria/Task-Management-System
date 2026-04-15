import { z } from "zod";

//  LOGIN
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
//  SIGN UP
export const signupSchema = z.object({
  
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// RESEND EMAIL
export const resendSchema = z.object({
  email: z.string().email(),
});

//  VERIFY CODE
export const verifyOTPSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

// FORGOT PASSWORD
export const forgotSchema = z.object({
  email: z.string().email(),
});