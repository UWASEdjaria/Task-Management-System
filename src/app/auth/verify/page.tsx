'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Internal imports
import { apiFetch } from "../../../lib/apiFetch";
import { verifyOTPSchema } from "../../../lib/validations";

type VerifyFormData = z.infer<typeof verifyOTPSchema>;

export default function Verify() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // Initialize form with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Verification submit handler
  const onVerifySubmit = async (data: VerifyFormData) => {
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/auth/verify-otp", {
        method: "POST",
        body: { email, otp: data.otp }
      });

      if (!res.success) {
        setError(res.message || "Invalid code.");
        return;
      }

      // Session storage logic
      if (res.token) localStorage.setItem("token", res.token);
      if (res.data) localStorage.setItem("user", JSON.stringify(res.data));

      router.push("/dashboard");
      
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logic to ensure only numbers are entered
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const onlyNums = value.replace(/[^0-9]/g, "");
    if (onlyNums.length <= 6) {
      setValue("otp", value, { shouldValidate: true });
    }
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center bg-gray-100 px-4 py-1">
      <div className="flex flex-col md:flex-row shadow-xl rounded-2xl overflow-hidden max-w-5xl w-full bg-white min-h-[600px]">
        
        {/* Left Column: Form */}
        <div className="bg-white min-h-screen flex flex-col justify-center rounded-2xl shadow-lg p-8 md:w-1/2 w-full text-center">
          <div className="mb-6 flex justify-left">
            <div className="w-14 h-14 p-2 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-left">
              <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="object-contain" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Verify Your Email</h1>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Enter the verification code sent to <strong>{email}</strong>.
          </p>

          {/* Error Display (Server errors or Validation errors) */}
          {(error || errors.otp) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">
              {error || errors.otp?.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onVerifySubmit)} className="mt-6 flex flex-col gap-4">
            <input
              {...register("otp")}
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit code"
              onChange={(e) => {
                 const value = e.target.value.replace(/[^0-9]/g, "");
                 if (value.length <= 6) {
                 setValue("otp", value);
                 } 
               }}
              className={`w-full px-4 py-2 text-center border rounded-lg bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 ${
                errors.otp ? "border-red-500" : "border-transparent"
              }`}
            />
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & sign in"}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-500">
            Didn&apos;t get the verification code?{" "}
            <Link 
              href={`/auth/resend?email=${encodeURIComponent(email)}`} 
              className="text-gray-600 hover:underline font-medium"
            >
              Resend
            </Link>
          </p>

          <div className="max-w-5xl w-full mt-6">
            <Link href="/" className="text-gray-600 hover:text-black text-sm">← Back Home</Link>
          </div>
        </div>

        {/* Right Column: Visual Info */}
        <div className="min-h-screen bg-gray-200 p-8 md:w-1/2 flex flex-col justify-center text-center items-center max-w-lg shadow-lg hidden md:flex">
          <h1 className="text-2xl md:text-4xl font-bold text-black mb-4">
            One Final Step to Secure Your Account
          </h1>
          <p className="text-sm md:text-base text-gray-700 font-sans">
            We take your security seriously. Enter the code sent to your email to verify your identity and protect your personal workspace.
          </p>
        </div>

      </div>
    </div>
  );
}