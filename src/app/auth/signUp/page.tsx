'use client';
import Link from 'next/link'
import React, {useState ,FormEvent} from 'react'
import {useRouter} from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { signupSchema } from '../../../lib/validations'

function Signup() {
  
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [accountExists, setAccountExists] = useState(false)

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setAccountExists(false)
    const formData = new FormData(e.currentTarget)
    const name = formData.get('fullName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // safeParse() runs all Zod rules at once — replaces all the if statements above
   const result = signupSchema.safeParse({ 
      fullName: name, 
      email, 
      password, 
      confirmPassword 
    })
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password ,fullName:name}),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409 || data.error?.includes('exists')) {
       setAccountExists(true);
      }
       setError(data.error || 'Something went wrong.');
       return;
    }
      router.push('/')
    } catch {
      setError('Network error. Please try again.')
    }
  }
  return (
       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        {/* MASTER CARD: This holds both sides */}
         <div className="flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden max-w-5xl w-full bg-gray-300">

          {/* LEFT COLUMN: The Signup Form */}
          <div className="bg-white p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
           {/* Logo */}
            <div className="mb-6 flex justify-center md:justify-start">
              <div className="w-14 h-14 p-2 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-center">
                <Image 
                  src="/logo.jpg" 
                  alt="Logo" 
                  width={48} 
                  height={48} 
                  className="object-contain"
                />
              </div>
            </div>
            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 text-center">
            Create Account
            </h1>
            <p className="mt-2 text-sm text-gray-600 text-center font-sans font-medium">
            Join TaskTrack to start managing your tasks efficiently
           </p>
           {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
            {error}
            {accountExists && (
              <Link href="/" className="block mt-1 underline text-red-700 hover:text-red-900">
                Go to Login
              </Link>
            )}
          </div>
            )}
           <form onSubmit={handleSignup} className="mt-6 flex flex-col gap-4 font-sans">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="fullName"
              type="text"
              placeholder="John Doe"
              className="mt-1 w-full bg-gray-200 text-gray-900 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full bg-gray-200 text-gray-900 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="mt-1 w-full bg-gray-200 text-gray-900 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="mt-1 w-full bg-gray-200 text-gray-900 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500 font-sans">
          Already have an account?{" "}
          <Link href="/" className="text-gray-500 hover:text-gray-800 hover:underline">
            Log in
          </Link>
         </div>
         
        </div>
        {/* right column */}
       <div className="bg-gray-200 md:w-1/2 p-8  flex flex-col items-center justify-center text-center hidden md:flex">
          <div className="max-w-[280px]">
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-3 leading-tight">
              Start Organizing Today
            </h1>
            <p className="text-sm text-gray-600 font-sans leading-relaxed">
              Create your account in seconds and start tracking your progress with ease.
            </p>
          </div>
          </div>
        </div>
       </div>
  )
}

export default Signup
