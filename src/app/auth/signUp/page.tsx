'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signupSchema } from '../../../lib/validations'
import { apiFetch } from "@/lib/apiFetch"

type SignupFormData = z.infer<typeof signupSchema>

function Signup() {
  const router = useRouter()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [accountExists, setAccountExists] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit,formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // Form submission handler
  const onSubmit = async (data: SignupFormData) => {
    setServerError('')
    setAccountExists(false)
    setIsLoading(true)

    try {
      const res = await apiFetch("/auth/signup", {
        method: 'POST',
        body: { 
          email: data.email, 
          password: data.password, 
          fullName: data.fullName 
        },
      })

      if (!res.success) {
        // Handle existing account conflict
        if (res.message?.toLowerCase().includes('exists')) {
          setAccountExists(true)
        }
        setServerError(res.message || 'Something went wrong.')
        return
      }

      router.push('/')
    } catch (error) {
      setServerError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden max-w-5xl w-full bg-gray-300">
        
        {/* Signup form container */}
        <div className="bg-white p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
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

          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 text-center">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-600 text-center font-sans font-medium">
            Join TaskTrack to start managing your tasks efficiently
          </p>

          {/* Feedback for server-side errors */}
          {serverError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
              {serverError}
              {accountExists && (
                <Link href="/" className="block mt-1 underline text-red-700 hover:text-red-900">
                  Go to Login
                </Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4 font-sans">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                {...register('fullName')}
                type="text"
                placeholder="John Doe"
                className={`mt-1 w-full bg-gray-100 text-gray-900 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && <span className="text-xs text-red-500 mt-1">{errors.fullName.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className={`mt-1 w-full bg-gray-100 text-gray-900 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                {...register('password')}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`mt-1 w-full bg-gray-100 text-gray-900 px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password.message}</span>}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`mt-1 w-full bg-gray-100 text-gray-900 px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && <span className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500 font-sans">
            Already have an account?{" "}
            <Link href="/" className="text-gray-500 hover:text-gray-800 hover:underline">
              Log in
            </Link>
          </div>
        </div>

        {/* Informational sidebar */}
        <div className="bg-gray-200 md:w-1/2 p-8 flex flex-col items-center justify-center text-center hidden md:flex">
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