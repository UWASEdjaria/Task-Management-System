'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { apiFetch } from "../../../lib/apiFetch"


export default function ResendPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0)
  const [iserror, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [seconds])

  const handleResend = async () => {
    if (seconds > 0 || !email) return;
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await apiFetch('/auth/send-otp', {
        method: 'POST',
        body: { email },
      })

      if (!res.success) {
        setMessage(res.message || 'Failed to resend code.')
        setIsError(true)
        return
      }

      // Success logic
      setMessage('A new code has been sent to your inbox!')
      setSeconds(60)
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000)

      // Redirect to verify page after 3 seconds
      setTimeout(() => {
        router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
      }, 3000);

    } catch {
      setMessage('Network error. Please try again.')
      setIsError(true)
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-1 font-sans text-gray-900">
      <div className="flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden max-w-5xl w-full bg-white min-h-screen">
      <div className="md:w-1/2 w-full bg-white p-8 md:p-12 shadow-2xl shadow-gray-100  border border-gray-100 transition-all">
        
        <div className="text-center">
          <div className="w-14 h-14 p-2 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-start mb-6">
            <Image 
              src="/logo.jpg" 
              alt="Logo" 
              width={48} 
              height={48} 
              className="object-contain"
            />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Check your email</h1>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed">
            We have sent a password reset link to your email address. 
            Please click the link in the email to continue.
          </p>

          {message && (
          <div className="mt-6 p-3 bg-green-50 border border-green-100 text-green-700 text-xs rounded-xl font-medium animate-pulse">
            {message}
          </div>
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the email?
          </p>
          <button
            onClick={handleResend}
            disabled={seconds > 0}
            className="mt-2 text-sm text-gray-600 hover:underline disabled:opacity-50"
          >
           {loading ? 'Sending...' : seconds > 0 ? `Resend in ${seconds}s` : 'Request a new code'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm font-sans hover:text-gray-900 hover:underline transition-colors">
            ← Back to Login
          </Link>
        </div>

        <div className="mt-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
           <h2 className="text-sm font-bold text-slate-800 tracking-tight">Almost There!</h2>
           <p className="mt-1 text-xs text-slate-500 leading-relaxed">
             Check your spam folder if you don&apos;t see the email in your inbox within a few minutes.
           </p>
        </div>
        
      </div>
       <div className="bg-gray-200 md:w-1/2 p-8  flex flex-col items-center justify-center text-center hidden md:flex">
          <div className="max-w-[280px]">
            <h2 className="text-2xl font-bold text-black mb-3">Almost There!</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Check your spam folder if you don&apos;t see the email in your inbox within a few minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
