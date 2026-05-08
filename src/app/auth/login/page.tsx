'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validations'
import { z } from 'zod'
import { apiFetch } from "@/lib/apiFetch"
import { APP_NAME } from '@/lib/constants'

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setError('')
    setLoading(true)
    try {
      const res = await apiFetch("/auth/login", {
        method: 'POST',
        body: data,
      })

      if (!res.success) {
        setError(res.message || 'Invalid email or password.')
        setLoading(false)
        return
      }

      await apiFetch("/auth/send-otp", {
        method: "POST",
        body: { email: data.email },
      })

      router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`)
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 font-sans">
      <div className="flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden max-w-5xl w-full bg-white h-[85vh] md:h-[700px]">
        
        {/* LEFT SIDE: Login Form */}
        <div className="bg-white p-8 md:p-14 md:w-1/2 flex flex-col overflow-y-auto">
          <div className="my-auto">
            <div className="w-14 h-14 p-2 mb-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center justify-start">
              <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="object-contain" />
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{APP_NAME}</h1>
            <p className="mt-2 text-sm text-gray-600">Welcome back! Log in to manage your tasks on {APP_NAME}</p>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={`mt-1 w-full bg-gray-100 text-gray-900 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all ${
                    errors.email ? 'border-red-400' : 'border-transparent'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  {...register('password')}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`mt-1 w-full bg-gray-100 text-gray-900 px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all ${
                    errors.password ? 'border-red-400' : 'border-transparent'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-gray-800 text-white py-2.5 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              New user? <Link href="/auth/signUp" className="text-gray-900 hover:underline font-medium">Create an account</Link>
            </div>
          </div>
        </div>

        <div className="bg-gray-200 p-8 md:p-12 md:w-1/2 flex flex-col justify-center text-center hidden md:flex border-l border-gray-100">
          <h1 className="text-2xl md:text-4xl font-bold text-black mb-4 px-4">
            Organize your work and track progress easily
          </h1>
          <p className="text-sm md:text-base text-gray-700 font-sans px-6">
            Collaborate with your team, stay organized, and get more done every day.
          </p>
        </div>
      </div>
    </div>
  )
}