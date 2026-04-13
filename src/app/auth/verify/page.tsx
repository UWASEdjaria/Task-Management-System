'use client';
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Verify() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!otp) { setError("Please enter the verification code."); return; }
    if (otp.length !== 6) { setError("The code must be exactly 6 digits."); return; }

    setLoading(true);
    try {
     const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid code."); return; }

     localStorage.setItem("token", data.token);
     localStorage.setItem("user", JSON.stringify(data.data));

     router.push("/dashboard");
     
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    await fetch("http://localhost:5000/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setError("A new code has been sent to your email.");
  };

  const handleInputChange = (value: string) => {
    const onlyNums = value.replace(/[^0-9]/g, "");
    if (onlyNums.length <= 6) setOtp(onlyNums);
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center bg-gray-100 px-4 py-1">
      <div className="flex flex-col md:flex-row shadow-xl rounded-2xl overflow-hidden max-w-5xl w-full bg-white min-h-[600px]">
        <div className="bg-white min-h-screen flex flex-col justify-center rounded-2xl shadow-lg p-8 md:w-1/2 w-full text-center">
          <div className="mb-6 flex justify-left">
            <div className="w-14 h-14 p-2 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-left">
              <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="object-contain" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Verify Your Email</h1>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Enter the verification code sent to your email to confirm your account.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-medium">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full px-4 py-2 text-center border rounded-lg bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
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
            className="text-gray-600 hover:underline">Resend
         </Link>
          </p>
          <div className="max-w-5xl w-full mb-4">
            <Link href="/" className="text-gray-600 hover:text-black text-sm">← Back Home</Link>
          </div>
        </div>
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
