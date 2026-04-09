'use client'
import Link from 'next/link'
import React, { useState,FormEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { forgotSchema } from '@/lib/validations'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSent, setIsSent] = useState(false)
  const router = useRouter()

  const handleResetRequest = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Zod validates the email format
    const result = forgotSchema.safeParse({ email })
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    try {
      // Call the real forgot-password API which sends OTP to email
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }
      setIsSent(true)
      // Redirect to verify page with email so user can enter OTP + new password
      router.push(`/auth/verify?email=${encodeURIComponent(email)}&mode=reset`)
    } catch {
      setError('Network error. Please try again.')
    }
  }
  return (
    // MAIN CONTAINER: Centers the card on the screen
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-sans text-gray-900">
      
      <div className="flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden max-w-5xl w-full bg-white">

        {/* Forgot Password section */}
        <div className="bg-white p-8 md:w-1/2 flex flex-col justify-center">

        {/* Logo Section */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 p-2 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-left">
            <Image 
              src="/logo.jpg" 
              alt="Logo" 
              width={48} 
              height={48} 
              className="object-contain"
            />
          </div>
        </div>

        {/* shows green tick if isSent is true*/}
        <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-all ${isSent ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
           {isSent ? <span>✓</span> : <span>?</span>}
        </div>
        
        {/* Heading Section */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight">{isSent ? "Check Email" : "Forgot Password?"}</h1>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
           {isSent 
              ? `We've sent a reset link to ${email}. Please check your inbox.` 
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>
          {error && (
          <div className="mt-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
            {error}
          </div>
        )}
        {/* Form Section */}
        {!isSent && (
        <form onSubmit={handleResetRequest} className="mt-10 flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
            />
          </div>

         <button 
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold text-center hover:bg-gray-700 transition-all shadow-lg shadow-gray-200 mt-2"
            >
              Send Reset Link
            </button>
        </form>
        )}

        {/* Footer Section */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-slate-900 hover:underline transition-colors">
            <span className="mr-2">←</span> Back to Login
          </Link>
        </div>

        {/* Bottom Security Note (Small touch for Pro look) */}
        <div className="mt-6 bg-slate-50 p-4 rounded-xl">
           <p className="text-xs text-slate-500 text-center font-medium">
             Protecting your tasks and progress is our priority.
           </p>
        </div>
        </div>

        {/* Right side content (same as homepage) */}
        <div className="bg-gray-200 min-h-screen p-8 md:w-1/2 flex flex-col justify-center text-center hidden md:flex">
          <h1 className="text-2xl md:text-4xl font-bold text-black mb-4">
            Never Lose Access to Your Tasks
          </h1>
          <p className="text-sm md:text-base text-gray-700 font-sans">
            Reset your password securely and get back to managing your projects in minutes.
          </p>
        </div>
      </div>
    </div>
  )
}
